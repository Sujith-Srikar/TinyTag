import React, {useState} from 'react'

function GenerateQR() {
  const [input, setInput] = useState("");
  const [qrCode, setQrCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateQRCode = async () => {
    if (!input.trim()) {
      alert("Please enter valid content!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/generateqr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input }),
      });
      console.log(response)
      const blob = await response.blob();
      console.log(blob)
      setQrCode(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error generating QR Code:", error);
      alert("Failed to generate QR Code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="border-white border-2 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-200">
          QR Code Generator
        </h1>
        <input
          type="text"
          placeholder="Enter text or URL"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={generateQRCode}
          className={`w-full p-3 bg-blue-500 text-white rounded-lg ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate QR Code"}
        </button>
        {qrCode && (
          <div className="mt-6 text-center">
            <h2 className="text-lg font-medium text-gray-700 mb-2">
              Your QR Code:
            </h2>
            <img
              src={qrCode}
              alt="Generated QR Code"
              className="mx-auto border border-gray-200 rounded-lg"
            />
            <a
              href={qrCode}
              download="qrcode.png"
              className="inline-block mt-4 p-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
            >
              Download QR Code
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default GenerateQR
