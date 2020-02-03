$(document).ready(function() {
    
    $.getJSON("/api/users/all", function(data) {
        console.log("Working...");
        console.log(data);
    })

})