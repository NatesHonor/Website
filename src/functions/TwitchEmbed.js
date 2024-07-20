import React, { useEffect, useState } from 'react';

const TwitchEmbed = ({ channelName }) => {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const scriptId = 'twitch-embed-script';
    const embedId = 'twitch-embed';

    const loadEmbedScript = () => {
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = "https://embed.twitch.tv/embed/v1.js";
        script.async = true;
        script.onload = () => {
          new window.Twitch.Embed(embedId, {
            width: "100%",
            height: 480,
            channel: channelName,
            parent: ["embed.example.com", "othersite.example.com"]
          });
          setIsLive(true);
        };
        document.body.appendChild(script);
      } else {
        if (window.Twitch && window.Twitch.Embed) {
          new window.Twitch.Embed(embedId, {
            width: "100%",
            height: 480,
            channel: channelName,
            parent: ["embed.example.com", "othersite.example.com"]
          });
          setIsLive(true);
        }
      }
    };

    loadEmbedScript();

    return () => {
      const embedDiv = document.getElementById(embedId);
      if (embedDiv) {
        embedDiv.innerHTML = '';
      }
    };
  }, [channelName]);

  if (!isLive) {
    return null;
  }

  return <div id="twitch-embed"></div>;
};

export default TwitchEmbed;
