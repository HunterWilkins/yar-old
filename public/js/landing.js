$(document).ready(function() {


    $("#signin-box").on("click", function(){
        let top = `${(parseInt($(this).css("top").replace("px", "")) + 50)}` + "px";
        console.log(top);
        console.log("Firing!");
        $("#signin-box form").css({"visibility":"visible", "opacity": "1", "top": "110%"});
    });

    $("#signin-box form button").on("click", function() {
        event.preventDefault();
        $.ajax({
            url: "/api/signin",
            method: "POST",
            data: {
                username: $("#landing-user").val(),
                password: $("#landing-password").val(),
            },
            success: function() {
                window.location.replace("/dash");
            },
            error: function() {
                alert("No User Found! Try again or Sign Up.")
            }
            
        })
    })


})