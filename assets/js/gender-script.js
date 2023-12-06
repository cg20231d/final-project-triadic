document.addEventListener('DOMContentLoaded', function() {
    // Mendapatkan elemen checkbox
    const checkbox = document.getElementById("gender");
    const resultContent = document.getElementById('resultGender');
    console.log(checkbox);

    // Menambahkan event listener untuk memantau perubahan status checkbox
    

    checkbox.addEventListener("change", function() {
        if (checkbox.checked) {
            resultContent.textContent = `Laki - Laki`;
            resultContent.style.display = 'block';
        } else {
            resultContent.textContent = `Perempuan`;
            resultContent.style.display = 'block';
        }
    });
});
