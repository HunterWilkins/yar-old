$(document).ready(function() {

    let user = {
        interests: [],
        priorities: [],
        termination: []
    };

    let matches = {
        ideal: [],
        personality: [],
        basic: [] 
    }


    $.getJSON("/api/currentUser", function(data) {
        for (x in data) {   
            user[x] = data[x];
        }
        console.log(user.religion.slice(1));
        $("aside").append(
            `
            <p>Gender: ${capitalize(user.gender)}</p>
            <p>${capitalize(user.race)}</p>
            <p>Age: ${user.age}</p>
            <p>${capitalize(user.religion)}</p>
            <p>${user.politics === "right" || "left" ? capitalize(user.politics) + " Wing": "Moderate"}</p>
            <p></p>
            `
        );
    });
    
    $.getJSON("/api/users/all", function(data) {
        console.log(data);

        data.forEach(item => {
            matchmaker(item);
                  
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

    $("#messages button").on("click", function() {
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
                text: $("#messages textarea").val()
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
                        <p>${item.p} : ${item.text}</p>
                        <br>
                        `
                    )
                })
            }
        })
    }

    function fullScreen(data) {

        console.log(data.biology.username);

        refreshMessages(data.biology)

        let descriptions = {
            babies : "",
            priority: "My main priority at the moment is " + data.answers.priority.toLowerCase(),
            sexy: "I'd wear " + data.answers.sexy.toLowerCase() + " to show off my goods.",
            leisure: data.answers.leisure !== "Trick Question: I'd stay home." ? "My Ideal Date location: " + data.answers.leisure : "I like to stay home in my spare time."
        }

        let roleDescription = [
            "Submissive",
            "Moderately Submissive",
            "Moderate Gender Role",
            "Moderately Dominant",
            "Dominant"
        ]

        if (data.answers.babies > 10) {
            descriptions.babies = "I want SOOO MANY BABIES! More than 10 at least!";
        }

        else if (data.answers.babies === 0) {
            descriptions.babies = "I don't want any children.";
        }

        else {
            descriptions.babies = "I want about " + data.answers.babies + " babies."
        }

        let rolestest = [
            0,1,2,3,4
        ]

        let desiredRole = Math.abs(data.personality.role - 4);
        
        for (x in data.biology) {
            if (x !== "image") {
                if (user[x] === data.biology[x] && x !== "name" && x !== "gender" && x !== "username") {
                    $("#" + x).attr("class", "matched-item");
                }
                
                $("#" + x).text( typeof data.biology[x] === "string" ? capitalize(data.biology[x]) : data.biology[x]);
            }

            else {
                $("#image").append(`<img src = "${data.biology[x]}"></img>`)
            }
        }

        for (x in data.personality) {
            if (x !== "role" && x !== "politics") {
                $("#" + x).append(
                    `
                    <p ${user[x] === data.personality[x] ? "class = 'matched-item'":"" }>${capitalize(data.personality[x])}</p>
                    ` 
                );    
            }

            else if (x === "politics") {
                $("#" + x).append(
                    `
                    <p ${user[x] === data.personality[x] ? "class = 'matched-item'":"" }>${ data.personality[x] === "moderate" ? "Moderate Politics": capitalize(data.personality[x]) + " Wing"}</p>
                    ` 
                );    
            }

            else {
                $("#" + x).append(
                    `
                    <p ${user[x] === desiredRole ? "class = 'matched-item'":"" }>${roleDescription[data.personality.role]}</p>
                    ` 
                );
            }
        }

        for (x in data.answers) {
            if (typeof data.answers[x] === "object") {
                if (x === "interests") {
                    if (data.answers.interests.length === 1) {
                        populate("#answers", "p", `I'm interested in ${data.answers.interests[0]}!`);
                    }
                    else {
                        // data.answers.interests.splice(data.answers.interests.length-1, 0, "and");
                        let firstInterests = data.answers.interests.slice(0, data.answers.interests.length-1).join(", ");
                        let finalInterest = data.answers.interests[data.answers.interests.length-1];

                        console.log(firstInterests);
                        console.log(finalInterest);
                        
                        populate("#answers", "p", `I'm interested in ${firstInterests}, and ${finalInterest}! <br><br>`);
                    }
                }
                
               
            }

            else {
                $("#answers").append(
                    `
                    <p ${user[x] === data.answers[x] ? "class = 'matched-item'" : ""}>${descriptions[x]}</p>
                    <br>
                    `
                )
            }
        }

        $("#full-view").css({"display": "block"});
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
            "prolife",
            "politics",
            "role",
            "babies"
        ];
        
        let similarities = 0;

        let incompatible = false;

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

        criteria.forEach(item => {
            
            if (user.prolife === match.prolife) {
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
            }
        });

        if (incompatible === false) {
            let target;
        if (similarities === criteria.length) {
            target = "#ideal-matches";
        }

        else if (similarities >= (criteria.length)/2) {
            target = "#secondary-matches";
        }

        else {
            target = "#basic-matches"
        }

        let babiesDesc;
        switch(match.babies) {
            case 0:
                babiesDesc = "no children."
                break;
            case 11: 
                babiesDesc = "TONS of babies! More than ten, at least!"
                break;
            default: 
                babiesDesc = match.babies + " babies.";
        }

        $(target).append(
            `
            <div class = "result" data-name = "${match.username}">
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
            </div>
            `
        );  

        }
    }

    function populate(destination, element, string) {
        $(destination).append(`<${element}>${string}</${element}>`)
    }

})