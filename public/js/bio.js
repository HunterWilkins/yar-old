$(document).ready(function(){

    let genderRoles = {
        male: [
            "Submissive little boiii",
            "Less Submissive little boii",
            "Moderate boii",
            "Less Moderate Man",
            "Big boii"
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
        "Musician",
        "Coding",
        "Writing",
        "Reading",
        "Fitness",
        "Movies",
        "TV"
    ]

    interests.forEach(item => {
        $("#interests").append(
            `
            <input type="checkbox" name="interests" id = "${item}" value = "${item}">
            <label class = "check-button" for = "${item}">${item}</label>
            <br>

            `
        )
    })

    // Gender Role Selector Functionality
    $("input[name=gender]").on("change", function() {
        if ($("input[name=role]").css("display") === "none", $("label[for=role]").css("display") === "none") {
            toggleDisplay(["input[name=role]", "label[for=role]", "#role-description"], "block");
        }
        $("input[name=role]").val(2);
        $("#role-description").text(genderRoles[$(this).val()][2]);
    });
    // =/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/

    $("select[name=race]").on("change", function() {
        if ($(this).val() === "mixed") {
            toggleDisplay("input[name=mixed-race]", "block");
        }
        else if ($("input[name=mixed-race]").css("display") === "block") {
            $("input[name=mixed-race]").css("display", "none");
        }
    });

    $("input[name=role]").on("change", function() {
        $("#role-description").text(genderRoles[$("input[name=gender]:checked").val()][$(this).val()])
    });
    
    $("#autofill").on("click", function() {
        let userInfo = {
            interests : [],
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
                    userInfo.interests.push($(this).val());    
                }
            }

            else if ($(this).val() !== null && $(this).val().length >= 1) {
                userInfo[$(this).attr("name")]= $(this).val();
            }
        });  
        
        console.log(userInfo);
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