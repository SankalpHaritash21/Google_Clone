import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";

import MicIcon from "../assets/mic.svg";
import ImageIcon from "../assets/image.svg";

const SearchInput = () => {
  const { query } = useParams();
  const [searchQuery, setSearchQuery] = useState(query || "");
  const [isListening, setIsListening] = useState(false); // Track if speech recognition is active
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Cleanup function to stop speech recognition when component unmounts
    return () => {
      if (isListening) {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.stop();
        }
      }
    };
  }, [isListening]);

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      setIsListening(true); // Start listening

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false); // Stop listening
        navigate(`/${transcript}/${1}`); // Automatically navigate to the search result
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setErrorMessage(`Error occurred in recognition: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log("Speech recognition service has stopped.");
        setIsListening(false);
      };

      recognition.start();
    } else {
      console.log("Web Speech API not supported by this browser.");
      setErrorMessage(
        "Your browser does not support speech recognition. Please use Google Chrome."
      );
    }
  };

  const searchQueryHandler = (event) => {
    if (event?.key === "Enter" && searchQuery?.length > 0) {
      navigate(`/${searchQuery}/${1}`);
    }
  };

  return (
    <div
      id="searchBox"
      className="h-[46px] w-full md:w-[584px] flex items-center gap-3 px-4 border border-[#dfe1e5] rounded-3xl hover:bg-white hover:shadow-c hover:border-0 focus-within:shadow-c focus-within:border-0"
    >
      <AiOutlineSearch size={18} color="#9aa0a6" />
      <input
        type="text"
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyUp={searchQueryHandler}
        value={searchQuery}
        autoFocus
        placeholder={isListening ? "Speak something..." : "Type something..."}
        className="grow outline-0 text-black/[0.87]"
      />
      <div className="flex items-center gap-3">
        {searchQuery && (
          <IoMdClose
            size={24}
            color="#70757a"
            className="cursor-pointer"
            onClick={() => setSearchQuery("")}
          />
        )}
        <button
          onClick={handleVoiceInput}
          style={{
            padding: "10px",
            fontSize: "16px",
            cursor: "pointer",
            marginLeft: "10px",
          }}
        >
          <img className="h-6 w-6 cursor-pointer" src={MicIcon} alt="Mic" />
        </button>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        <img className="h-6 w-6 cursor-pointer" src={ImageIcon} alt="Image" />
      </div>
    </div>
  );
};

export default SearchInput;
