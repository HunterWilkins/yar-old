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
    })
    
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

    function fullScreen(data) {
        
        for (x in data.biology) {
            $("#profile").append(
                x !== "image" ?
                `
                <p>${x} : ${data.biology[x]}</p>
                ` 
                :
                `
                <img src = "${data.biology[x]}"></img>
                `
            )
        }

        for (x in data.personality) {
            $("#profile").append(
                `
                <p>${x} : ${data.personality[x]}</p>
                ` 
            );
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
                        
                        populate("#answers", "p", `I'm interested in ${firstInterests}, and ${finalInterest}!`)
                    }
                }
                
                $("#answers").append("<hr>");
            }

            else {
                $("#answers").append(
                    `
                    <p>${x + " : " + data.answers[x]}</p>
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
                    console.log("Matching: Roles");
                    similarities++;
                }
                
                else if (item === "age") {
                    if (Math.abs(user.age - match.age) <= 3) {
                        console.log("Just in the age range!");
                        similarities++;
                    }
                }

                else if (item === "babies") {
                    if (Math.abs(user.babies - match.babies) <= 2) {
                        console.log("Match: Babies");
                        similarities++;
                    }
                }

                else if (user[item] === match[item]) {
                    console.log("Matching: " + item);
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
                        <span>${roleDesc[match.role]}</p>
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