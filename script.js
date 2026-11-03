const typingArea = document.getElementById("typingArea");
const keyboard = document.getElementById("keyboard");
const clearBtn = document.getElementById("clearBtn");
const charCount = document.getElementById("charCount");

let shiftEnabled = false;

function updateCount() {
  const count = typingArea.value.length;
  charCount.textContent = `${count} ${count === 1 ? "character" : "characters"}`;
}

function insertText(text) {
  const start = typingArea.selectionStart;
  const end = typingArea.selectionEnd;
  const current = typingArea.value;

  typingArea.value = current.slice(0, start) + text + current.slice(end);
  const cursor = start + text.length;
  typingArea.setSelectionRange(cursor, cursor);
  typingArea.focus();
  updateCount();
}

function deleteCharacter() {
  const start = typingArea.selectionStart;
  const end = typingArea.selectionEnd;

  if (start !== end) {
    typingArea.value = typingArea.value.slice(0, start) + typingArea.value.slice(end);
    typingArea.setSelectionRange(start, start);
  } else if (start > 0) {
    typingArea.value = typingArea.value.slice(0, start - 1) + typingArea.value.slice(end);
    typingArea.setSelectionRange(start - 1, start - 1);
  }
  typingArea.focus();
  updateCount();
}

keyboard.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const action = button.dataset.action;
  const key = button.dataset.key;

  if (action === "backspace") {
    deleteCharacter();
  } else if (action === "space") {
    insertText(" ");
  } else if (action === "shift") {
    shiftEnabled = !shiftEnabled;
    button.classList.toggle("pressed", shiftEnabled);
  } else if (key === "Enter") {
    insertText("\n");
  } else if (key) {
    insertText(shiftEnabled ? key.toUpperCase() : key.toLowerCase());
    if (shiftEnabled) {
      shiftEnabled = false;
      keyboard.querySelector('[data-action="shift"]').classList.remove("pressed");
    }
  }
});

clearBtn.addEventListener("click", () => {
  typingArea.value = "";
  typingArea.focus();
  updateCount();
});

typingArea.addEventListener("input", updateCount);

document.addEventListener("keydown", (event) => {
  const keyButton = [...keyboard.querySelectorAll("[data-key]")].find(
    button => button.dataset.key.toLowerCase() === event.key.toLowerCase()
  );
  if (keyButton) {
    keyButton.classList.add("pressed");
    setTimeout(() => keyButton.classList.remove("pressed"), 120);
  }
});

updateCount();