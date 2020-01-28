$(document).ready(function() {


    $("#signin-box").on("click", function(){
        let top = `${(parseInt($(this).css("top").replace("px", "")) + 50)}` + "px";
        console.log(top);
        console.log("Firing!");
        $("#signin-box form").css({"visibility":"visible", "opacity": "1", "top": "110%"});
    });


})