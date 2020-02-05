$(document).ready(function(){

    let genderRoles = {
        male: [
            "Submissive",
            "Moderately Submissive",
            "Moderate",
            "Moderately Dominant",
            "Dominant"
        ],

        female: [
            "Submissive little goil",
            "Less Submissive little goil",
            "Moderate goil",
            "Less Moderate lady",
            "Big goil"
        ]
    }

    let interests = [
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
    ]

    let questions = [
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
                "Long Distance Relationship",
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
    ];

    questions.forEach(item=>{

        $("#question-box").append(
            `
            <p>${item.q}</p>
            <hr>
            `
        );

        if (item.type === "range") {
            $("#question-box").append(
                `
                <input type="${item.type}" name="${item.name}" id = "babies" step = "1" min = "${item.min}" max = "${item.max}" value = "0">
                <p id = "babies-desc">None</p>
                `
            )
        }

        else {
            item.a.forEach(answer => {
            
                $("#question-box").append(
                    `
                    <input type="${item.type}" name="${item.name}" id = "${answer}" value = "${answer}">
                    <label for="${answer}" class = "${item.type === "radio" ? "radio-button": "check-button"}">
                    ${answer}
                    </label>
                    `
                )    
            });      
        }


        $("#question-box").append("<br><br><hr>");
    });

    interests.forEach(item => {
        $("#interests").append(
            `
            <input type="checkbox" name="interests" id = "${item}" value = "${item}">
            <label class = "check-button" for = "${item}">${item}</label>
            `
        )
    });

    // Gender Role Selector Functionality
    
    // =/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/

    $("select[name=race]").on("change", function() {
        if ($(this).val() === "mixed") {
            toggleDisplay("input[name=mixed-race]", "block");
        }
        else if ($("input[name=mixed-race]").css("display") === "block") {
            $("input[name=mixed-race]").css("display", "none");
        }
    });

    $("input[name=role]").on("input", function() {
        $("#role-description").text(genderRoles.male[$(this).val()])
    });

    $("input[name=gender]").on("click", function() {
        console.log($(this).val());
    })
    
    $("#autofill").on("click", function() {
        let userInfo = {
            interests : [],
            priorities: [],
            termination: []
        };
        $("main div input, select").each(function(index) {
            if ($(this).attr("type") === "radio") {
                if ($(this).is(":checked")) {
                    userInfo[$(this).attr("name")]= $(this).val();
                }
            }

            else if ($(this).attr("type") === "checkbox") {
                if ($(this).is(":checked")) {
                    console.log($(this).val());
                    userInfo[$(this).attr("name")].push($(this).val());    
                }
            }

            else if ($(this).val() !== null && $(this).val().length >= 1) {
                userInfo[$(this).attr("name")]= $(this).val(); 
            }
        });

        $.ajax({
            url: "/api/signup",
            method: "POST",
            data: userInfo,
            success: function(data) {
                window.location.replace("/dash")
            }
        })
        
        console.log(userInfo);
    });

    $("#question-box").on("input", "#babies", function() {
        let desc;
        switch($(this).val()) {
            case "0":
                desc = "None."
                break;
            
            case "11": 
                desc = "SOOOO MANY!!! (10+)";
                break;
                
            default: 
                desc = $(this).val();
                break;
        }

        $("#question-box #babies-desc").text(desc);
    });

    function toggleDisplay(elements, option) {
        if (typeof elements === "object") {
            elements.forEach(element => {
                if ($(element).css("display") !== option) {
                    $(element).css("display", option);
                }
            });
        }

        else if ($(elements).css("display") !== option) {
                $(elements).css("display", option);
        }
    }

});