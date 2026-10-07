// Extensión opcional. Instalar eslint solo si deseas ejecutar el linter por CLI.
export default [{ignores:['frontend/assets/**','backend/data/**']},{files:['**/*.js','**/*.mjs'],languageOptions:{ecmaVersion:'latest',sourceType:'module'},rules:{'no-debugger':'error'}}];
