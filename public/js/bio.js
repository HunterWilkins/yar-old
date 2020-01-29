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

    // Gender Role Selector Functionality
    $("input[name=gender]").on("change", function() {
        if ($("input[name=role]").css("display") === "none", $("label[for=role]").css("display") === "none") {
            toggleDisplay(["input[name=role]", "label[for=role]"], "block");
        }
        $("input[name=role]").val(2);
        $("#role-description").text(genderRoles[$(this).val()][2]);
    });

    $("select[name=race]").on("change", function() {
        if ($(this).val() === "mixed" && $("input[name=mixed-race]").css("display") === "none") {
            $("input[name=mixed-race]").css("display", "block");
        }
        else if ($("input[name=mixed-race]").css("display") === "block") {
            $("input[name=mixed-race]").css("display", "none");
        }
    })

    $("input[name=role]").on("change", function() {
        console.log($(this).val());
        console.log(genderRoles.female[$(this).val()])
        console.log($("input[name = gender]:checked").val())
        $("#role-description").text(genderRoles[$("input[name=gender]:checked").val()][$(this).val()])
    })

    function toggleDisplay(elements, option) {
        elements.forEach(element => {
            $(element).css("display", option);
        });
    }

});