// Resim yükleme işlevi
function handleImageUpload(event) {
  var file = event.target.files[0];
  var image = new Image();
  var canvas = document.getElementById("image-canvas");
  var context = canvas.getContext("2d");

  image.onload = function () {
    canvas.width = image.width;
    canvas.height = image.height;
    context.clearRect(0, 0, canvas.width, canvas.height); // Canvas'ı temizle

    // Resmi çizmeden önce arka planı transparan yap
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.drawImage(image, 0, 0);

    // Spot kanalı ve beyaz katman uygulama işlevi
    function applySpotChannelWithWhiteLayer() {
      // Resim verilerini al
      var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      var data = imageData.data;

      // Yeni bir katman oluştur
      var whiteLayerData = context.createImageData(canvas.width, canvas.height);
      var whiteLayer = whiteLayerData.data;

      // Her pikselde spot kanalını ve beyaz katmanı uygula
      for (var i = 0; i < data.length; i += 4) {
        var r = data[i]; // Kırmızı bileşen
        var g = data[i + 1]; // Yeşil bileşen
        var b = data[i + 2]; // Mavi bileşen

        // Spot kanalını hesapla
        var spot = Math.max(r, g, b);

        // R, G ve B kanallarına spot kanal değerini uygula
        data[i] = spot; // Kırmızı kanal
        data[i + 1] = spot; // Yeşil kanal
        data[i + 2] = spot; // Mavi kanal

        // Beyaz katmanı uygula
        whiteLayer[i] = 255; // Kırmızı kanal
        whiteLayer[i + 1] = 255; // Yeşil kanal
        whiteLayer[i + 2] = 255; // Mavi kanal
        whiteLayer[i + 3] = data[i + 3]; // Alpha kanalını aynı bırak
      }

      // İşlenmiş verileri canvas'a geri yükle
      context.putImageData(imageData, 0, 0);
      context.globalCompositeOperation = "destination-over"; // Arka planı transparan yapmak için eklendi
      context.putImageData(whiteLayerData, 0, 0);
    }

    // Spot kanalı ve beyaz katmanı uygula
    applySpotChannelWithWhiteLayer();
  };

  if (file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      image.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

// Resim yükleme olayını dinleme
var imageUploadInput = document.getElementById("image-upload");
imageUploadInput.addEventListener("change", handleImageUpload);

// PNG olarak kaydetme işlevi
function saveAsPNG() {
  var canvas = document.getElementById("image-canvas");

  // PNG dosyasını indir
  var link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "resim.png";
  link.setAttribute("download", "resim.png");
  link.click();
}

// PNG olarak kaydetme olayını dinleme
var saveButton = document.getElementById("save-button");
saveButton.addEventListener("click", saveAsPNG);
