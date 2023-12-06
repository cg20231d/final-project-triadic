document.addEventListener("DOMContentLoaded", function() {
    // Your existing JavaScript code
    document.getElementById("shopeeButton").addEventListener("click", function() {
        changeButtonColor("shopeeButton", "#ee4d30","#f6a697");
    });

    document.getElementById("lazadaButton").addEventListener("click", function() {
        changeButtonColor("lazadaButton", "#0f146f","#555de8");
    });

    document.getElementById("tokopediaButton").addEventListener("click", function() {
        changeButtonColor("tokopediaButton", "#03ac0e","#5afc64");
    });

    function changeButtonColor(buttonId, oldColor, newColor) {
        var button = document.getElementById(buttonId);
        button.style.backgroundColor = newColor;
        setTimeout(function() {
            button.style.backgroundColor = oldColor; // Revert to default color
        }, 3000);
    }
});