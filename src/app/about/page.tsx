import Panel from "@/Components/UI/Panel";
import { panelSubtitle, panelTitle } from "@/Utils/ui";

const STACK = [
  "Next.js App Router",
  "React 19",
  "TypeScript",
  "Tailwind CSS v4",
  "Better Auth",
  "MongoDB",
  "Nodemailer",
  "React Icons",
];

const page = () => {
  return (
    <>
      <div>
        <p className="text-xs font-medium text-muted">Company</p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          About Expensely
        </h1>
        <p className="mt-1 text-sm text-muted">
          A simple, private way to track your daily spending.
        </p>
      </div>

      <div className="mt-5 grid max-w-3xl gap-4">
        <Panel>
          <h2 className={panelTitle}>What it does</h2>
          <p className={`${panelSubtitle} mt-2 leading-relaxed`}>
            Expensely helps you record expenses, set a spending balance, and
            understand where your money goes with weekly, monthly, and
            category-based breakdowns.
          </p>
        </Panel>

        <Panel>
          <h2 className={panelTitle}>Your data stays with you</h2>
          <p className={`${panelSubtitle} mt-2 leading-relaxed`}>
            Your expenses and balance are stored in your own MongoDB account,
            keyed to your user id and only ever read back for you. Accounts are
            protected by email verification, and every write is checked
            server-side before it touches the database.
          </p>
        </Panel>

        <Panel>
          <h2 className={panelTitle}>Built with</h2>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted">
            {STACK.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
};

export default page;
