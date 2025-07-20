document.addEventListener('DOMContentLoaded', () => {
    // Use the variable names from your starter code
    const form = document.getElementById('chat-form');
    const input = document.getElementById('user-input');
    const submitButton = form.querySelector('button');
    const chatContainer = document.getElementById('chat-container');

    // The main submit event listener, now an async function
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const userMessage = input.value.trim();
        if (!userMessage) {
            return;
        }

        // Display user's message
        appendMessage('user', userMessage);
        input.value = '';

        // Disable form controls to prevent multiple submissions
        input.disabled = true;
        submitButton.disabled = true;

        // Show a "thinking..." indicator while waiting for the response
        const thinkingIndicator = appendMessage('bot', '...');

        try {
            // This is the fetch() call to your backend API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) {
                // Try to get a specific error message from the backend, or fall back to a generic one
                const errorData = await response.json().catch(() => ({ reply: `HTTP error! Status: ${response.status}` }));
                throw new Error(errorData.reply);
            }

            const data = await response.json();

            // Update the "thinking" message with the actual reply from Gemini
            thinkingIndicator.querySelector('p').textContent = data.reply;

        } catch (error) {
            console.error('Error communicating with the backend:', error);
            thinkingIndicator.querySelector('p').textContent = `Sorry, something went wrong: ${error.message}`;
        } finally {
            // Scroll to the bottom of the chat
            chatContainer.scrollTop = chatContainer.scrollHeight;

            // Re-enable form controls and focus the input
            input.disabled = false;
            submitButton.disabled = false;
            input.focus();
        }
    });
    
    // This function adds a new message bubble to the chat window
    function appendMessage(role, text) {
        const messageDiv = document.createElement('div');
        const cssClass = role === 'user' ? 'user-message' : 'bot-message';
        messageDiv.className = `message ${cssClass}`;
        messageDiv.innerHTML = `<p>${text}</p>`;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return messageDiv; // Return the new message element
    }
});