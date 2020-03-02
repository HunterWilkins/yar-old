$(document).ready(function() {
  
    let user;

    let matches = {
        ideal: [],
        personality: [],
        basic: [] 
    }

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

        $.getJSON("/api/matchmaker/ideal", function(results) {
            console.log(results);
    
            results.forEach(item => {
                matchmaker(item);  
            });
        });
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

    $("#custom-match").on("change", function() {
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

    $("aside input[type=radio]").on("input", function(){
        console.log($(this).val());
        $.getJSON("/api/matchmaker/" + $(this).val(), function(data) {
            $("section").each(function(){
                $(this).empty();
            })
            data.forEach(item => {
                matchmaker(item);
            })
        })
    })

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
        return string.slice(0)[0].toUpperCase() + string.slice(1);
    }

    function matchmaker(match) {
        let criteria = [
            "race",
            "age",
            "religion",
            "outgoing",
            "politics",
            "role",
            "babies",
            "state"
        ];
        
        let similarities = 0;

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

        criteria.forEach(item => {
            if (item === "role" && user.role === roleDesires[match.role]) {
                similarities++;
            }
            
            else if (item === "age") {
                if (Math.abs(user.age - match.age) <= 3) {
                    similarities++;
                }
            }

            else if (item === "babies") {
                if (Math.abs(user.babies - match.babies) <= 2) {
                    similarities++;
                }
            }

            else if (user[item] === match[item]) {
                similarities++;
            }
        
        });

        console.log(similarities);

        if (similarities === criteria.length) {
            target = "#ideal-matches";
        }

        else {
            target = "#secondary-matches";
        }
        
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

        $(target).append(
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

    function populate(destination, element, string) {
        $(destination).append(`<${element}>${string}</${element}>`)
    }

})