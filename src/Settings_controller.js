const $ = require("jquery");

$(document).ready(() => {
    $(".mtd-settings-tab").click(function() {
        $(".mtd-settings-tab-selected").removeClass("mtd-settings-tab-selected");
        $(this).addClass("mtd-settings-tab-selected");
        console.log("asdsafdsadsa")
        /*
            calculates how far to move over the settings menu
            good thing arrays start at 0, as 0 would be 0px, it's the first one
        */

        $(".mtd-settings-inner").css("margin-left","-"+($(this).index()*700)+"px");
    });

})
