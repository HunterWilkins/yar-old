$(document).ready(function() {
  
    let user;

    let matches = {
        ideal: [],
        personality: [],
        basic: [] 
    };

    let filterFields = [
        "religion",
        "politics",
        "role",
        "height",
        "weight",
        "babies",
        "race",
        "outgoing",
        "location",
        "sexy",
        "confrontation"
    ]

    let filter = ["religion", "politics", "location"];

    $("input[name=presets]").on("change", function() {
        filter = [];
        switch ($(this).attr("id")) {
            case "custom":
                $("#filters").css("display", "block");
                break;
            case "ideal":
                if ($("#filters").css("display") === "block") {
                    $("input[name=filters]").each(function() {
                        $(this).attr("checked", "true");
                        filter.push($(this).attr("id"));
                    })
                }

                else {
                    filter = filterFields;
                }
                break;
            case "secondary":
                if ($("#filters").css("display") === "block") {
                    $("input[name=filters]").each(function() {
                        let value = $(this).attr("id");
                        filter.push(value);
                        if (value === "religion" || value === "politics" || value === "location" || value === "race" || value === "role" || value === "babies" || value === "confrontation" || value === "sexy") {
                            $(this).attr("checked", "true");
                        }
                        else {
                            $(this).attr("checked", false);
                        }
                    })
                }
                else {
                    filter = ["religion", "politics", "location", "race", "role", "babies", "confrontation", "sexy"];
                }
                break;
                case "basic":
                    if ($("#filters").css("display") === "block") {
                        $("input[name=filters]").each(function() {
                            let value = $(this).attr("id");
                            filter.push(value);
                            if (value === "religion" || value === "politics" || value === "location") {
                                $(this).attr("checked", "true");
                            }
                            else {
                                $(this).attr("checked", false);
                            }
                        })
                    }
                    else {
                        filter = ["religion", "politics", "location"];
                    }
                    break;
                default:
                    break;
            
        }
        
        if ($(this).attr("id") !== "custom") {
            matchmaker();
        }

        console.log($(this).attr("id"));
    });

    $("input[name=filters]").on("change", function(){
        filter = [];
        $("input[name=filters]").each(function(index) {
            if (document.querySelector("#" + $(this).attr("id")).checked) {
                filter.push($(this).attr("id"));
            }
        });
        console.log(filter);

        matchmaker();
    })

    $.getJSON("/api/currentUser/dash", function(data) {
        user = data;
        console.log(data);
        $("#user-info").append(
            `
            <p>${capitalize(user.race)}</p>
            <p>Age: ${user.age}</p>
            <p>${capitalize(user.religion)}</p>
            <p>${user.politics === "right" || "left" ? capitalize(user.politics) + " Wing": "Moderate"}</p>
            `
        );

        matchmaker();

    });

    $("section").on("click", ".result", function() {
        console.log("Firing");
        $.ajax({
            url: "/api/user/" + $(this).attr("data-name"),
            method: "GET",
            success: function(data) {
                console.log("Retrieved Information:");
                console.log(data);
                fullScreen(data);
            }
        })
    });

    $("#close-popup").on("click", function() {
        $("#full-view").css("display", "none");
        $("#profile div").empty();

        $("#answers").empty();
        $("#messages").empty();
    });

    $("#custom-match").on("value", function() {
        $.ajax({
            method: "POST",
            url: "/api/users/" + $(this).val(),
            data: {
                gender: user.gender,
                prolife: user.prolife,
                filterField: $(this).val(),
                filter: user[$(this).val()]
            },
            success: function(data) {
                console.log(data);
            }
        })
    });

    function refreshMessages(match) {
        console.log(match);
         $.ajax({
            url: "/api/messages",
            method: "POST",
            data: {
                recipient: {
                    username: match.username,
                    name: match.name
                },
                author: {
                    username: user.username,
                    name: user.name
                }
            },
            success: function(data) {
                console.log(data);
                data.messages.forEach(item => {
                    $("#messages section").append(
                        `
                        <p class = ${item.p === user.username ? "user-me" : "user-other"}><strong>${item.p}</strong></p>
                        <p class = ${item.p === user.username ? "user-me" : "user-other"}>${item.text}</p>
                        <br>
                        `
                    )
                },)

                let scrollHeight = document.querySelector("#messages section").scrollHeight;
                console.log(scrollHeight);
                $("#messages section").animate({
                    scrollTop: scrollHeight
                }, 0);
            }
        })
    }

    function capitalize(string) {
        if (string !== undefined && string.length > 0) {
            return string.slice(0)[0].toUpperCase() + string.slice(1);
        }
        else return string;

    }



    function matchmaker() {
        $("#matches").empty();

        $.post("/api/matchmaker/", {criteria: filter}, function(results) {
            results.forEach(match => {
                populate(match);
            })
        })
    }

    function populate(match) {
        
        let roleDesires = {
            0: 4,
            1: 3,
            2: 2,
            3: 1,
            4: 0
        }

        let roleDesc = {
            0: "Submissive",
            1: "Moderately Submissive",
            2: "Moderate",
            3: "Moderately Dominant",
            4: "Dominant"
        }

        let religionDesc;
        let babiesDesc;
                
        switch(match.babies) {
            case 0:
                babiesDesc = "No children."
                break;
            case 11: 
                babiesDesc = "TONS of babies! More than ten, at least!"
                break;
            default: 
                babiesDesc = match.babies + " babies.";
        }

        switch(match.religion) {
            case "christianity":
                religionDesc = "Christian";
                break;
            case "judaism":
                religionDesc = "Jew";
                break;
            case "islam":
                religionDesc = "Muslim";
                break;
            case "agnosticism":
                religionDesc = "Agnostic";
                break;
            case "atheism":
                religionDesc = "Atheist";
                break;
            case "hinduism":
                religionDesc = "Hindu";
                break;
            case "buddhism":
                religionDesc = "Buddhist";
                break;
            default:
                religionDesc = capitalize(match.religion);
                break;
        }

        $("#matches").append(
            `
            <a href = "/users/${match.username}" class = "result" data-name = "${match.username}">
                <div class = "inner">
                    <div class = "front">
                        <p class = "top">${match.name}</p>
                        <div class = "image-box">
                            <img src = "${match.image}"></img>
                        </div>
                        <p class = "bottom left">${capitalize(match.religion)}</p>
                        <p class = "bottom right">${match.age}</p>
                    </div>
                    <div class = "back">
                        <p>${match.politics === "moderate" ? "Moderate" : capitalize(match.politics) + " Wing"}</p>
                        <p>${roleDesc[match.role]}</p>
                        <p>I want to have ${babiesDesc}</p>
                        <p class = "bottom left">${match.height}</p>
                        <p class = "bottom right">${match.weight} lbs</p>
                    </div>
                </div>
            </a>
            `
        );  
    }

})