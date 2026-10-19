import Panel from "@/Components/UI/Panel";
import Bi from "@/Components/Bi/Bi";
import { panelSubtitle, panelTitle } from "@/Utils/ui";
import {
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
  FaHtml5,
  FaCss3,
  FaJs,
  FaReact,
  FaGitAlt,
  FaGithubAlt,
  FaJava,
  FaPython,
  FaNode,
} from "react-icons/fa";
import {
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiCplusplus,
  SiVercel,
  SiNetlify,
  SiExpress,
  SiBetterauth,
  SiMongodb,
  SiC,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";

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

const SOCIAL_LINKS = [
  {
    name: "GitHub",
    icon: FaGithub,
    link: "https://github.com/sm-sazzad",
    color: "hover:bg-[#181717] hover:border-[#181717]",
  },
  {
    name: "LinkedIn",
    icon: FaLinkedin,
    link: "https://www.linkedin.com/in/sm-sazzad/",
    color: "hover:bg-[#0A66C2] hover:border-[#0A66C2]",
  },
  {
    name: "Facebook",
    icon: FaFacebook,
    link: "https://www.facebook.com/sazzad.hossain.5758",
    color: "hover:bg-[#1877F2] hover:border-[#1877F2]",
  },
  {
    name: "Instagram",
    icon: FaInstagram,
    link: "https://www.instagram.com/sazzad_hossain5758/",
    color:
      "hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:border-transparent",
  },
  {
    name: "X",
    icon: FaTwitter,
    link: "https://x.com/sm_sazzad58",
    color: "hover:bg-black hover:border-black",
  },
  {
    name: "Email",
    icon: FaEnvelope,
    link: "https://mail.google.com/mail/?view=cm&fs=1&to=sazzadhossain5758@gmail.com",
    color: "hover:bg-[#EA4335] hover:border-[#EA4335]",
  },
];

const TECH_STACK = [
  { name: "HTML", icon: FaHtml5, color: "hover:text-[#E34F26]" },
  { name: "CSS", icon: FaCss3, color: "hover:text-[#1572B6]" },
  { name: "JavaScript", icon: FaJs, color: "hover:text-[#F7DF1E]" },
  { name: "TypeScript", icon: SiTypescript, color: "hover:text-[#3178C6]" },
  { name: "React", icon: FaReact, color: "hover:text-[#61DAFB]" },
  { name: "Next.js", icon: SiNextdotjs, color: "hover:text-white" },
  { name: "Node.js", icon: FaNode, color: "hover:text-[#046c04]" },
  { name: "Express.js", icon: SiExpress, color: "hover:text-white" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "hover:text-[#06B6D4]" },
  { name: "Betterauth", icon: SiBetterauth, color: "hover:text-white" },
  { name: "C", icon: SiC, color: "hover:text-[#00599C]" },
  { name: "C++", icon: SiCplusplus, color: "hover:text-[#00599C]" },
  { name: "Java", icon: FaJava, color: "hover:text-[#F89820]" },
  { name: "Python", icon: FaPython, color: "hover:text-[#3776AB]" },
  { name: "MongoDB", icon: SiMongodb, color: "hover:text-[#046c00]" },
  { name: "Git", icon: FaGitAlt, color: "hover:text-[#F05032]" },
  { name: "GitHub", icon: FaGithubAlt, color: "hover:text-white" },
  { name: "VS Code", icon: VscVscode, color: "hover:text-[#007ACC]" },
  { name: "Vercel", icon: SiVercel, color: "hover:text-white" },
  { name: "Netlify", icon: SiNetlify, color: "hover:text-[#00C7B7]" },
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

      {/* Developer Info */}
      <Panel className="mt-5">
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className={panelTitle}>
                <Bi en="Developer" bn="ডেভেলপার" />
              </h2>
              <p className={panelSubtitle}>
                Learn about the person behind Expensely.
              </p>
            </div>
          </div>

          {/* Profile */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-ink">
                Sheikh Md Sazzad Hossain
              </h3>
              <p className="text-sm font-medium text-muted">
                <Bi en="Web Developer" bn="ওয়েব ডেভেলপার" />{" "}
                <span className="text-accent">•</span>{" "}
                <Bi en="CSE Student" bn="CSE শিক্ষার্থী" />{" "}
                <span className="text-accent">•</span>{" "}
                <Bi
                  en="Future Software Engineer"
                  bn="ভবিষ্যৎ সফটওয়্যার ইঞ্জিনিয়ার"
                />
              </p>
              <p className="text-sm italic text-muted">
                <Bi
                  en="&ldquo;Building, Learning &amp; Growing One Project at a Time.&rdquo;"
                  bn="&ldquo;একটি একটি প্রজেক্ট দিয়ে বানানো, শেখা ও বেড়ে ওঠা।&rdquo;"
                />
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=sazzadhossain5758@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink transition hover:bg-accent hover:text-white hover:border-accent"
                >
                  <Bi en="Get In Touch" bn="যোগাযোগ করুন" />
                </a>
                <a
                  href="https://github.com/sm-sazzad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink transition hover:bg-accent hover:text-white hover:border-accent"
                >
                  <Bi en="View GitHub" bn="GitHub দেখুন" />
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-ink">
                <Bi en="Connect With Me" bn="আমার সাথে যুক্ত হোন" />
              </h3>
              <ul className="flex flex-wrap gap-3">
                {SOCIAL_LINKS.map(({ name, icon: Icon, link, color }) => (
                  <li key={name}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={name}
                      aria-label={name}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-white hover:bg-accent ${color}`}
                    >
                      <Icon aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-ink">
              <Bi en="Tech Stack" bn="প্রযুক্তি স্ট্যাক" />
            </h3>
            <ul className="flex flex-wrap gap-2">
              {TECH_STACK.map(({ name, icon: Icon, color }) => (
                <li key={name} title={name}>
                  <Icon
                    aria-hidden="true"
                    className={`h-6 w-6 text-muted transition-colors duration-300 group-hover:text-accent ${color}`}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer note */}
        <footer className="mt-8 pt-6 border-t border-line text-center">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Sheikh Md Sazzad Hossain — Built with
            Next.js &amp; Tailwind CSS
          </p>
        </footer>
      </Panel>
    </>
  );
};

export default page;
