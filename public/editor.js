const socket = io("http://localhost:5000");
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');

document.addEventListener('DOMContentLoaded', () => {
    socket.emit("get-document", "default-doc");
    socket.on("load-document", content => {
        editor.value = content;
        updatePreview();
    });
    socket.on("receive-changes", content => {
        editor.value = content;
        updatePreview();
    });
    editor.addEventListener('input', (e) => {
        socket.emit("send-changes", e.target.value);
        socket.emit("save-document", e.target.value);
        updatePreview();
    });
    window.addEventListener('beforeunload', () => socket.disconnect());
});

function updatePreview() {
    preview.innerHTML = marked.parse(editor.value);
}
