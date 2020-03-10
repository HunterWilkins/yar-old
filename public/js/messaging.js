$(document).ready(function() {

    $.getJSON("/api/myMessages", function(data) {
        console.log(data);
        
        data.authored.forEach(chat => {
            let authorData = {
                contact: chat.recipient,
                inbox: "authored",
                lastMessage: chat.messages[chat.messages.length-1],
            }

            populateInboxes(authorData);
        });

        data.received.forEach(chat => {
            let receivedData = {
                contact: chat.author,
                inbox: "received",
                lastMessage: chat.messages[chat.messages.length-1],
            }
            populateInboxes(receivedData);
        })
    });

    function populateInboxes(data) {
        $("#" + data.inbox).append(
            `
            <a href = "/users/${data.contact}" class = "message">
                <p class= "contact">${data.contact}</p>
                <hr>
                <em>Last Message...</em>
                <p class = "last-message"><strong>${data.lastMessage.p}</strong>: ${data.lastMessage.text}</p>
            </a>
            <br>
            `
        )
    }

});