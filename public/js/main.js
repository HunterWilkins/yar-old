$(document).ready(function(){

    $("#signup").on("click", function(){
        $.ajax({
            type: "POST",
            url: "/api/signup",
            data: {
                username: $("input[name = username]").val(),
                password: $("input[name = password]").val()
            }
        })
    });

    $("#signin").on("click", function(){
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: "/api/signin",
            data: {
                username: $("input[name = username]").val(),
                password: $("input[name = password]").val()
            },
            success: function() {
                window.location.replace("/dash");
            },
            error: function(data) {
                alert("No User Found. Try again.");
            }
        });
    });
    
    $("#logout").on("click", function() {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: "/api/logout",
            data: {
                logout: true   
            },
            success: function() {
                window.location.replace("/landing");
            }
        });
    });

    $("#favorites").on("change", function() {
        window.location.replace("/users/" + $(this).val());
    });

});