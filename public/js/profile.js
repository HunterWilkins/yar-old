$(document).ready(function() {

    let user;

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
    })

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
        console.log($(this).attr("id"));
        if (document.querySelector("#" + $(this).attr("id")).scrollHeight > 200) {
            $(this).animate({
                height: document.querySelector("#" + $(this).attr("id")).scrollHeight + 15 + "px"
            }, 0);    
        }
    }, function() {
        $(this).animate({
            height: "100%"
        }, 0);
    })
    $.getJSON("/api/currentUser", function(data) {
        user = data;
        console.log(user);
    });

    $.ajax({
        method: "GET",
        url: "/api/user/" + window.location.pathname.split("/")[2] + "",
        success: function(data) {
            console.log(data);
            populate(data);
        }
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
                            case "username":
                                $("#username").text(data[x][y]);
                                break;
                            case "politics":
                                specificText = (data[x][y] === "moderate" ? "Politically Moderate" : data[x][y] + " Wing");  
                                break;
                            
                            case "weight":
                                specificText = data[x][y] + "lbs";
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
                                specificText = "If I wanted to show off my goooooods, I'd wear " + (data[x][y] !== "Nothing (not recommended)" ? data[x][y].toLowerCase() : " absolutely nothing. ;)");
                                break;
                            default:
                                specificText = data[x][y];
                                break;
    
                        }
                    }
    
                    if (y !== "role" && y !== "image" && y !== "name" && y !== "username" && y !== "flags") {
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
        return string.slice(0)[0].toUpperCase() + string.slice(1);
    }

    function flag() {

    }
});