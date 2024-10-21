Hooks.on('preCreateChatMessage', (chatMessage, content) => {
    if (chatMessage.whisper.length !== 0) {
        const whisperTargets = new Set(chatMessage.whisper);

        game.users.forEach((user) => {
            if (user.isGM) {
                whisperTargets.add(user.id);
            }
        });

        chatMessage._source.whisper = Array.from(whisperTargets);
        chatMessage.whisper = Array.from(whisperTargets);
        content.whisper = Array.from(whisperTargets);
    }
});
