// Kept as a global ambient type (no import/export) so it is available across
// the app without importing. See AGENTS.md before adding export/import here.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface IForm {
    id: string,
    title: string,
    amount:string,
    category:string,
    date:string
}
