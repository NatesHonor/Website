import React, { useState } from 'react';
import '../styles/tempphoto.css';

// Require all media
const mediaContext = require.context('../Media/Photos/Temp', true, /\.(png|jpe?g|mp4|webm|gif)$/i);
// Require all JSON descriptions
const descContext = require.context('../Media/Photos/Temp', true, /desc\.json$/i);

const allMedia = mediaContext.keys().map((key) => ({
  path: key,
  src: mediaContext(key),
}));

// Group media by folder
const groupMediaByFolder = () => {
  const grouped = {};
  allMedia.forEach(({ path, src }) => {
    const match = path.match(/\.\/([^/]+)\//);
    const folder = match ? match[1] : 'unknown';
    const filename = path.split('/').pop();

    if (!grouped[folder]) grouped[folder] = [];
    grouped[folder].push({
      src,
      type: /\.(mp4|webm)$/i.test(path) ? 'video' : 'image',
      filename,
    });
  });
  return grouped;
};

// Load all folder descriptions from JSON
const loadFolderDescriptions = () => {
  const descriptions = {};

  descContext.keys().forEach((key) => {
    const match = key.match(/\.\/([^/]+)\//); // Extract folder name
    const folder = match ? match[1] : null;
    if (folder && !descriptions[folder]) {
      try {
        const data = descContext(key);
        descriptions[folder] = data.desc || '';
      } catch (err) {
        console.error(`Error loading desc.json for folder ${folder}:`, err);
      }
    }
  });

  return descriptions;
};

// Sort media within folder
const sortMediaInFolder = (mediaArray) => {
  const toNumber = (str) => {
    const match = str.match(/\d+/);
    return match ? parseInt(match[0], 10) : Infinity;
  };

  const isProof = (name) => /proof/i.test(name);

  const nonProof = mediaArray
    .filter(item => !isProof(item.filename))
    .sort((a, b) => toNumber(a.filename) - toNumber(b.filename));

  const proofGroups = {};
  const proofFiles = mediaArray.filter(item => isProof(item.filename));
  proofFiles.forEach((item) => {
    const prefix = item.filename.split('proof')[0].trim();
    if (!proofGroups[prefix]) proofGroups[prefix] = [];
    proofGroups[prefix].push(item);
  });

  const sortedProofGroups = Object.keys(proofGroups)
    .sort()
    .map((prefix) =>
      proofGroups[prefix]
        .sort((a, b) => toNumber(a.filename) - toNumber(b.filename))
    );

  const sortedProofFiles = sortedProofGroups.flat();

  return [...nonProof, ...sortedProofFiles];
};

// Sort folders
const sortFolders = (folders) => {
  const keys = Object.keys(folders);
  const isBonus = (name) => name.toLowerCase() === 'bonus';
  const toNumber = (name) => {
    const match = name.match(/\d+/);
    return match ? parseInt(match[0], 10) : Infinity;
  };

  const sorted = keys
    .filter(k => !isBonus(k))
    .sort((a, b) => toNumber(a) - toNumber(b));
  const bonus = keys.filter(isBonus);
  return [...sorted, ...bonus];
};

const Tempphoto = () => {
  const grouped = groupMediaByFolder();
  const sortedFolders = sortFolders(grouped);
  const folderDescriptions = loadFolderDescriptions();
  const [modalMedia, setModalMedia] = useState(null);

  return (
    <div className="tempphoto-scroll-container">
      {sortedFolders.map((folder) => {
        const sortedMedia = sortMediaInFolder(grouped[folder]);
        const description = folderDescriptions[folder];

        return (
          <div key={folder} className="folder-section">
            <h2>{folder}</h2>

            {description && (
              <div className="text-file-content">
                <p>{description}</p>
              </div>
            )}

            <div className="media-grid">
              {sortedMedia.map((item, idx) =>
                item.type === 'image' ? (
                  <img
                    key={idx}
                    src={item.src}
                    alt={`media-${idx}`}
                    onClick={() => setModalMedia(item)}
                  />
                ) : (
                  <video key={idx} controls>
                    <source src={item.src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )
              )}
            </div>
          </div>
        );
      })}

      {modalMedia && modalMedia.type === 'image' && (
        <div className="modal" onClick={() => setModalMedia(null)}>
          <img src={modalMedia.src} alt="Full Size" />
        </div>
      )}
    </div>
  );
};

export default Tempphoto;
