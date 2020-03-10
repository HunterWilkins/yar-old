$(document).ready(function() {

    let user;
    let match;

    let flags = [
        "Polygamous",
        "Disloyal",
        "Dishonest...",
        "Controlling",
        "Abusive",
        "Disrespectful",
        "Humorless",
        "Noncommital",
        "Alcoholic",
        "Drug User",
        "Smoker",
        "Bad Hygiene",
        "Rude",
        "Incel-Type Behavior",
        "Unconfident",
        "Arrogant",
        "Cheap",
        "Financially Debonair"
    ];

    let lies = [
        "Age",
        "Political Stance",
        "Relationship Status",
        "Religion",
        "Hobbies",
        "Priorities",
        "Preferred Gender Role",
        "Height",
        "Weight",
        "How many babies he/she wanted",
        "Biological Sex",
        "Race",
        "Name",
        "Identity",
        "Pro-Life Stance",
        "Other..."
    ]

    flags.forEach(flag => {
        $("select[name=redFlags]").append(
            `
            <option value = "${flag}">${flag}</option> 
            `
        );
    });

    lies.forEach(lie => {
        $("select[name=lies]").append(
            `
            <option value = "${lie}">${lie}</option> 

            `
        )
    });

    $.getJSON("/api/currentUser/info", function(data) {
        user = data;
        console.log(user);

        $.ajax({
            method: "GET",
            url: "/api/user/" + window.location.pathname.split("/")[2] + "",
            success: function(userData) {
                match = userData;
                refreshMessages(match);
                console.log(userData);
                populate(userData);
            }
        });
    });

    $("select[name=redFlags]").on("change", function() {
        if ($(this).val() === "Dishonest...") {
            $("#lies").css("display", "block");
        }

        else if ($("#lies").css("display") === "block") {
            $("#lies").css("display", "none");
        }
    });

    $("select[name=lies]").on("change", function() {
        if ($(this).val() === "Other...") {
            $("#other-lies").css("display", "block");
        }
        else if ($("#other-lies").css("display") === "block") {
            $("#other-lies").css("display", "none");
        }
    });

    $("#flag-user").on("click", function() {
        $("#flag").css("display", "block");
    });

    $("#cancel").on("click", function() {
        $("#flag").css("display", "none");
    });

    $(".tab").on("click", function() {
        $("section").css("display", "none");
        $("#" + $(this).attr("data-link")).css("display", "inline-block");
        $(".tab").attr("class", "tab");
        $(this).attr("class", "active tab");
    });

    $("#flags, #stars").hover(function(){
        if (document.querySelector("#" + $(this).attr("id")).scrollHeight > 200) {
            $(this).animate({
                height: document.querySelector("#" + $(this).attr("id")).scrollHeight + 15 + "px"
            }, 0);    
        }
    }, function() {
        $(this).animate({
            height: "100%"
        }, 0);
    });

    $("#messaging button").on("click", function() {
        $.ajax({
            method: "PUT",
            url: "/api/message",
            data: {
                recipient: {
                    username: $("#username").text(),
                    name: $("#name").text(),
                },
                author: {
                    username: user.username,
                    name: user.name
                },
                text: $("#messaging textarea").val()
            },
            success: function() {
                let scrollHeight = document.querySelector("#messaging article").scrollHeight;
                console.log(scrollHeight);
                $("#messaging article").animate({
                    scrollTop: scrollHeight
                }, 1000);
            }
        });

        $("#messaging article").append(
            `
            <p class = "user-me">${user.username}</p>
            <p class = "user-me">${$("#messaging textarea").val()}</p>
            `
        );

        $("#messaging textarea").val("");

    });

    function populate(data) {
        let target;

        for (x in data) {
            if (x === "flags" || x === "stars") {
                data[x].forEach(item => {
                    $("#" + x + " ul").append(`<li>${item}</li>`)
                })
            }

            else {
                for (y in data[x]) {
                    specificText = "";
    
                    if (y === "image") {
                    $("figure").append(
                        `
                        <img src = "${data.biology.image}" alt = "picture"></img>
                        `
                    );
                    }
    
                    else if (typeof data[x][y] === "object") {   
                        data[x][y][data[x][y].length-1] = "and " + data[x][y][data[x][y].length-1] 
                        if (y !== "termination") {
                            specificText =  (y === "interests" ? "I enjoy " : "My current priorities are ") + data[x][y].join(", ").toLowerCase() + "."; 
                        }
    
                        else if (data[x][y] !== null) {
                            let grammerizedTermination = data[x][y].join(", ").toLowerCase();
                            grammerizedTermination[0] = grammerizedTermination[0].toUpperCase();
                            specificText = grammerizedTermination + " are all factors I take into account when deciding whether to end a relationship."; 
                        }
    
                        else {
                            specificText = "I wouldn't break up with someone for any reason outside of abuse.";
                        }
                    }
    
                    else {
                        switch(y) {
                            case "name":
                                $("#name").text(data[x][y]);
                                break;
                            case "age":
                                $("#" + x).append(
                                    `
                                    <p ${Math.abs(data[x][y] - user.age) < 3 ? "class = 'matched'": ""}>${data[x][y]} years old</p>
                                    `
                                );
                                break;
                            case "username":
                                $("#username").text(data[x][y]);
                                break;
                            case "politics":
                                specificText = (data[x][y] === "moderate" ? "Politically Moderate" : data[x][y] + " Wing");  
                                break;
                            
                            case "weight":
                                specificText = data[x][y] + "lbs";
                                break;
                            case "confrontation":
                                let description = [
                                    "Upfront with Confrontation",
                                    "Midway with Confrontation",
                                    "Non-Confrontational"
                                ]

                                specificText = description[data[x][y]];
                                break;
    
                            case "babies":
                                switch(data[x][y]) {
                                    case 0:
                                        specificText = "I want no children.";
                                        break;
                                        case 11:
                                            specificText = "I want SO MANY BABIES! More than TEN at least!"
                                            break;
                                        default:
                                            specificText = "I want " + data[x][y] + " children.";
                                            break;
                
                                }
                                break;
                            case "leisure":
                                specificText = "My Ideal Date Location: " + data[x][y];
                                break;
                            case "role":
                                switch (data[x][y]) {
                                    case 0: 
                                        specificText = "Submissive";
                                        break;
                                    case 1: 
                                        specificText = "Moderately Submissive";
                                        break;
                                    case 2: 
                                        specificText = "Moderate";
                                        break;
                                    case 3:
                                        specificText = "Moderately Dominant";
                                        break;
                                    case 4: 
                                        specificText = "Dominant";
                                        break;
                                }
                                $("#" + x).append(
                                    `
                                    <p ${Math.abs(user.role - data[x][y]) >= user.role - 2 ? "class = 'matched'": ""}>${specificText}</p>
                                    `
                                );
                                break;
                            case "height":
                                let idealHeight = false;
                                if (data.biology.gender === "female") {
                        
                                    if (parseInt(data.biology.height.split("\'")[0]) < parseInt(user.height.split("\'")[0])) {
                                        idealHeight = true;
                                    }

                                    else if (parseInt(data.biology.height.split("\'")[0]) === parseInt(user.height.split("\'")[0]) && parseInt(data.biology.height.split("\'")[1]) < parseInt(user.height.split("\'")[1])) {
                                        idealHeight = true;
                                    }
                                }

                                $("#" + x).append(
                                    `
                                    <p ${idealHeight === true ? "class = 'matched'" : ""} id = "${y}">${data.biology.height}</p>
                   
                                    `
                                );

                                break;
                            case "religion":
                                switch(data[x][y]) {
                                    case "christianity":
                                        specificText = "Christian";
                                        break;
                                    case "judaism":
                                        specificText = "Jew";
                                        break;
                                    case "islam":
                                        specificText = "Muslim";
                                        break;
                                    case "agnosticism":
                                        specificText = "Agnostic";
                                        break;
                                    case "atheism":
                                        specificText = "Atheist";
                                        break;
                                    case "hinduism":
                                        specificText = "Hindu";
                                        break;
                                    case "buddhism":
                                        specificText = "Buddhist";
                                        break;
                                    default:
                                        specificText = capitalize(data[x][y]);
                                        break;
                                }
                                break;
                            case "priority":
                                specificText = "My current top priority is " + data[x][y];
                                break;
                            case "sexy":
                                let sexyChart = {
                                    "Chest":"A V-Neck", 
                                    "Arms":"A Tank Top",
                                    "Belly" : "A Crop Top",
                                    "Buttocks": "Tight/Short Pants",
                                    "Face": "A Flannel Overshirt w/ White Undershirt",
                                    "All of the Above": "Nothing"
                                }

                                specificText = "If I wanted to show off my goooooods, I'd wear " + (data[x][y] !== "Nothing" ? sexyChart[data[x][y]].toLowerCase() + ".": " absolutely nothing. ;)");
                                $("#" + x).append(
                                    `
                                    <p ${sexyChart[data[x][y]] === user.attraction ? "class = 'matched'": ""}>${specificText}</p>
                                    `
                                );
                                break;
                            default:
                                specificText = data[x][y];
                                break;
                        }
                    }
    
                    if (y !== "role" && y !== "sexy" &&  y !== "age" && y !== "height" && y !== "image" && y !== "name" && y !== "username" && y !== "flags") {
                    $("#" + x).append(
                        `
                        <p ${user[y] === data[x][y] ? "class = 'matched'" : ""} id = "${y}">${typeof specificText !== "number" && specificText !== undefined ? capitalize(specificText) : specificText}</p>
                        ${x === "answers" ? "<hr>": ""}
                        `
                    );
    
                    }
                }
            }
         
        }

    }

    function capitalize(string) {

        if (string !== undefined && string !== "undefined" && string.length !== 0) {
            if (typeof string === "string") {
                return string.slice(0)[0].toUpperCase() + string.slice(1);
            }
            else {
                return string
            }
        }

        else {
            console.log("Undefined Variable");
        }
    }

    function flag() {

    }

    function refreshMessages(match) {
        console.log(match);
         $.ajax({
            url: "/api/messages",
            method: "POST",
            data: {
                recipient: {
                    username: match.biology.username,
                    name: match.biology.name
                },
                author: {
                    username: user.username,
                    name: user.name
                }
            },
            success: function(data) {
                console.log(data);
                data.messages.forEach(item => {
                    if (item.p === user.username) {
                        $("#messaging article").append(
                            `
                            <p class = "user-me"><strong>${item.p}</strong></p>
                            <p class = "user-me">${item.text}</p>
                            <br>
                            `
                        );
                    }

                    else {
                        $("#messaging article").append(
                            `
                            <a class = "user-other" href = "/users/${item.p}">${item.p}</a>
                            <a class = "user-other" href = "/users/${item.p}">${item.text}</a>
                            <br>
                            `
                        )
                    }
                },)

                let scrollHeight = document.querySelector("#messaging article").scrollHeight;
                console.log(scrollHeight);
                $("#messaging article").animate({
                    scrollTop: scrollHeight
                }, 0);
            }
        })
    }
});