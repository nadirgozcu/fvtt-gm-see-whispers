// Ensure this script is only executed after Foundry VTT is fully initialized
Hooks.once('ready', function() {
    const originalProcessMessage = ChatLog.prototype.processMessage;

    ChatLog.prototype.processMessage = async function(messageText) {
        // Check if the message is a whisper and the sender is not 'Gamemaster'
        if (messageText.startsWith("/w") && game.user.role !== CONST.USER_ROLES.GAMEMASTER) {
            const whisperPattern = /^(\/w(?:hisper)?\s+)(\[[^\]]*\]|\S+)(\s+.*)/;
            const match = whisperPattern.exec(messageText);

            if (match) {
                const command = match[1]; // The whisper command (e.g., "/w" or "/whisper")
                let targets = match[2]; // The original target(s)
                const restOfMessage = match[3]; // The actual message content

                // Check if "GM" is already included among the targets; if not, add it
                if (!targets.toUpperCase().includes('GM')) {
                    if (targets.startsWith("[")) {
                        // If there are multiple targets, add "GM" within the brackets
                        targets = targets.slice(0, -1) + `, GM]`;
                    } else {
                        // If there's only a single target, create an array including "GM"
                        targets = `[GM, ${targets}]`;
                    }
                }

                // Reconstruct the whisper command with "GM" added if necessary
                messageText = command + targets + restOfMessage;
            }
        }

        // Call the original ChatLog.processMessage function with the modified (or unmodified) message text
        return await originalProcessMessage.call(this, messageText);
    };
});