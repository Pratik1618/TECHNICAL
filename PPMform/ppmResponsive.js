document.addEventListener("DOMContentLoaded", function () {
    // Check if we're on a mobile device
    if (window.innerWidth <= 768) {
      // Create a toast notification to suggest landscape orientation
      var toast = document.createElement("div");
      toast.style.position = "fixed";
      toast.style.bottom = "20px";
      toast.style.left = "50%";
      toast.style.transform = "translateX(-50%)";
      toast.style.backgroundColor = "rgba(0,0,0,0.7)";
      toast.style.color = "#fff";
      toast.style.padding = "8px 12px";
      toast.style.borderRadius = "4px";
      toast.style.fontSize = "12px";
      toast.style.zIndex = "1000";
      toast.style.textAlign = "center";
      toast.innerText = "Rotate your device for better view";

      document.body.appendChild(toast);

      // Remove the toast after 5 seconds
      setTimeout(function () {
        document.body.removeChild(toast);
      }, 5000);
    }
  });