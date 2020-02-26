$(document).ready(function() {
    $.getJSON("/api/currentUser/settings", function(data){
        console.log(data);
        
        for (x in data) {
            if (x === "text") {
                    for (y in data[x]){
                        $("form").append(`<input type = "text" id = "${y}" placeholder = "${y} : ${data[x][y]}"></input>`);
                    }
            }

            else if (x === "range" || x === "number") {
                for (y in data[x]) {
                    $("form").append(`${x === "range" ? "<p>Desired Gender Role</p>" : ""}<input type = "${x}" id = "${data[x][y].placeholder}" min = "${data[x][y].min}" max = "${data[x][y].max}" placeholder = "${y} : ${data[x][y].placeholder}"></input>`);
                }
            }

            else if (x === "select") {
                for (y in data[x]){

                    let genres = {
                        religion : [
                            "christianity",
                            "judaism",
                            "islam",
                            "buddhism",
                            "hinduism",
                            "agnostic",
                            "atheism"
                        ],

                        race : [
                            "white",
                            "black",
                            "latino",
                            "asian",
                            "indian",
                            "native american"
                        ]
                    };

                    $("form").append(
                        `
                        <select name="religion">
                            ${genres[y].map(item => {
                                return (
                                    `<option ${data[x][y] === item ? "selected" : ""} value = ${item}>${item}</option>`
                                );
                            })}
                        </select>
                    
                        `);
    
                }
            }

            else if (x === "radio" || x === "checkbox") {

                let genres = {
                    interests : [
                        "Sports",
                        "Gaming",
                        "Art",
                        "Music",
                        "Coding",
                        "Writing",
                        "Reading",
                        "Fitness",
                        "Movies",
                        "TV"
                    ],

                    questions : [
                        {
                            q: "Precisely how many children do you want to have?",
                            a: [0],
                            min: 0,
                            max: 11,
                            name: "babies",
                            type: "range"
                        },
                        {
                            q: "If you wanted to take time off from your routine, where would you go?",
                            a: [
                                "Coffee Shop",
                                "Park",
                                "Movie Theater",
                                "Concert",
                                "Art Gallery",
                                "Church",
                                "Mall",
                                "Trick Question: I'd stay home."
                            ],
                            name: "leisure",
                            type: "radio"
                        },
                        {
                            q: "What's your current top priority?",
                            a: [
                                "Wealth",
                                "Fame",
                                "Physical Strength",
                                "Intellect",
                                "Family",
                                "Career Fulfillment",
                                "Religion"
                            ],
                            name: "priority",
                            type: "radio"
                        },
                        {
                            q: "Alright: What're your other priorities?",
                            a: [
                                "Self-Improvement",
                                "Self-Expression",
                                "Having a Good Time",
                                "General Fulfillment",
                                "Smarts",
                                "Health",
                                "My Family",
                                "My Religion",
                                "Money",
                                "My Dreams",
                                "Comfort"
                            ],
                            name: "priorities",
                            type: "checkbox"
                        },
                        {
                            q: "Is it better to be non-confrontational in a minor argument?",
                            a: [
                                "No. Communication is important. Nothing will get fixed if you're not willing to confront the issue.",
                                "Depends...I want to keep things civil, but a disagreement is a disagreement.",
                                "Absolutely. The most important thing is to enjoy each other's company. Real friends don't have heated debates."
                            ],
                            name: "confrontation",
                            type: "radio"
                        },
                        {
                            q: "What would it take for you to terminate a romantic relationship? You can still be friends after the fact.",
                            a: [
                                "Physical Unattractiveness",
                                "Severe Religious Disagreements",
                                "Severe Political Disagreements",
                                "Clinginess",
                                "Lack of good hygiene",
                                "The other's descent into poor health",
                                "The other's Apathy",
                                "The other's financial dependence",
                                "A Long Distance Relationship",
                                "A lack of excitement",
                                "A better romantic prospect",
                                "Sudden injury to me / the other"
                            ],
                            name: "termination",
                            type: "checkbox"
                        },
                        {
                            q: "If I had to capitalize on my best visual feature, I would wear...",
                            a: [
                                "A V-Neck",
                                "A Tank Top",
                                "A Crop Top",
                                "Tight/Short Pants",
                                "A Flannel Overshirt w/ White Undershirt",
                                "Nothing (not recommended)"
                            ],
                            name: "sexy",
                            type: "radio"
                        }
                    ]
                }

                .forEach(item => {
                    $("form").append(
                        `
                        <input type = "${x}" value = ></input>
                        `);
                });
            }

        }
    });

})