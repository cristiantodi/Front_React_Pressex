document.getElementById('toggleBoton').addEventListener('click', function() {
    var miDiv = document.getElementById('miDiv');
    
    // Alterna entre ocultar y mostrar el div
    if (miDiv.style.display === 'none' || miDiv.style.display === '') {
      miDiv.style.display = 'block'; // Muestra el div
    } else {
      miDiv.style.display = 'none'; // Oculta el div
    }
  });
  