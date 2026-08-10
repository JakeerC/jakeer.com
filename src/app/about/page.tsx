import Image from "next/image";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { siteConfig } from "@/lib/config";
import TechIcon from "@/components/TechIcon";

export const metadata = {
  title: "About | " + siteConfig.name,
  description: "Senior Software Engineer based in Bengaluru, India.",
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20 animate-fade-in">
      {/* 01. Hero Section */}
      <section className="flex flex-col items-center text-center mt-12 mb-32">
        <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden mb-10 border-4 border-[var(--border)] shadow-xl">
          <Image
            src="/profile.JPG"
            alt="Jakeer Chilakala"
            fill
            className="object-cover"
            priority
          />
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-4 text-[var(--text-primary)]">
          Jakeer Chilakala
        </h1>
        <h2 className="font-display text-2xl md:text-4xl italic mb-8 text-[var(--accent)]">
          Senior Software Engineer
        </h2>
        <p className="text-lg md:text-xl max-w-3xl text-[var(--text-secondary)] leading-relaxed mb-10">
          Experienced Senior Software Engineer with 6+ years of expertise in building data-intensive applications using React, Redux, and Spring Boot. Skilled in TDD, API-driven development, and micro-services architecture. Demonstrated ability to achieve 90%+ code coverage.
        </p>

        <div className="flex items-center gap-6">
          <a
            href="mailto:jakeerchilakala@gmail.com"
            className="p-4 rounded-full border border-[var(--border)] bg-[var(--surface-raised)] hover:bg-[var(--surface)] transition-all hover:border-[var(--accent)] hover:shadow-lg text-[var(--text-primary)]"
            aria-label="Email"
          >
            <FaEnvelope size={24} />
          </a>
          <a
            href={siteConfig.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-full border border-[var(--border)] bg-[var(--surface-raised)] hover:bg-[var(--surface)] transition-all hover:border-[var(--accent)] hover:shadow-lg text-[var(--text-primary)]"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={24} />
          </a>
          <a
            href={siteConfig.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-full border border-[var(--border)] bg-[var(--surface-raised)] hover:bg-[var(--surface)] transition-all hover:border-[var(--accent)] hover:shadow-lg text-[var(--text-primary)]"
            aria-label="GitHub"
          >
            <FaGithub size={24} />
          </a>
        </div>
      </section>

      {/* 02. Experience (Timeline Layout) */}
      <section className="mb-32">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl italic font-bold text-[var(--text-primary)]">
            Experience
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute top-0 left-6 md:left-24 bottom-0 w-[2px] bg-[var(--border)] z-0"></div>

          {/* Wells Fargo */}
          <div className="relative z-10 flex flex-col md:flex-row gap-8 mb-16">
            <div className="sticky top-24 md:w-48 shrink-0 self-start flex items-center">
              <div className="absolute left-6 md:left-24 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-[var(--accent)] bg-[var(--bg-primary)] shadow-[0_0_0_4px_var(--bg-primary)]"></div>
              <h3 className="font-display text-xl md:text-2xl font-bold ml-12 md:ml-32 text-[var(--text-secondary)]">
                2022 - Present
              </h3>
            </div>
            <div className="flex-1 ml-12 md:ml-0">
              <div className="p-6 md:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-all shadow-md hover:shadow-lg card">
                <h3 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-1">
                  Wells Fargo
                </h3>
                <h4 className="text-lg italic text-[var(--accent)] mb-5">
                  Senior Software Engineer
                </h4>
                <ul className="space-y-4 text-[var(--text-secondary)]">
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                    Developed a Micro-Frontend application using React for a Model Registration and Validation project.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                    Achieved 90%+ code coverage by implementing Test-Driven Development (TDD) with Jest and React Testing Library (RTL).
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                    Automated end-to-end testing using Selenium for improved test reliability and efficiency.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                    Optimized API interactions using RxJS and React Observables, reducing latency and enhancing performance.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Mphasis */}
          <div className="relative z-10 flex flex-col md:flex-row gap-8">
            <div className="sticky top-24 md:w-48 shrink-0 self-start flex items-center">
              <div className="absolute left-6 md:left-24 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-[var(--accent)] bg-[var(--bg-primary)] shadow-[0_0_0_4px_var(--bg-primary)]"></div>
              <h3 className="font-display text-xl md:text-2xl font-bold ml-12 md:ml-32 text-[var(--text-secondary)]">
                2018 - 2022
              </h3>
            </div>
            <div className="flex-1 ml-12 md:ml-0">
              <div className="p-6 md:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-all shadow-md hover:shadow-lg card space-y-10">
                <div>
                  <h3 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-1">
                    Mphasis
                  </h3>
                  <h4 className="text-lg italic text-[var(--accent)] mb-5">
                    Senior Software Engineer
                  </h4>
                  <ul className="space-y-4 text-[var(--text-secondary)]">
                    <li className="flex items-start gap-3">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                      Engineered a robust data-intensive application with React libraries, ensuring 90%+ code coverage through Test-Driven Development.
                    </li>
                  </ul>
                </div>
                
                <div className="pt-6 border-t border-[var(--border)]">
                  <h4 className="text-lg italic text-[var(--accent)] mb-5">
                    Software Engineer
                  </h4>
                  <ul className="space-y-4 text-[var(--text-secondary)]">
                    <li className="flex items-start gap-3">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                      Developed UIs using vanilla JavaScript, KendoUI (jQuery), HTML, and CSS.
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                      Built full-stack web apps with MERN stack (ReactJS, Material UI, Node.js, Express.js, MongoDB), integrating GraphQL and REST APIs.
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                      Implemented backend solutions with Java, PostgreSQL, and optimized data handling.
                    </li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-[var(--border)]">
                  <h4 className="text-lg italic text-[var(--accent)] mb-5">
                    Associate Software Engineer
                  </h4>
                  <ul className="space-y-4 text-[var(--text-secondary)]">
                    <li className="flex items-start gap-3">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                      Developed AI-driven conversational bots using AWS Lex, AWS Lambda, and Google Dialogflow to address business needs.
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                      Created an app with Microsoft Power Platform (PowerApps) to automate timesheet entry, streamlining workflows.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03. Skills & Education */}
      <section className="mb-32 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Skills */}
        <div>
          <h2 className="font-display text-4xl italic font-bold text-[var(--text-primary)] mb-10">
            Skills
          </h2>
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] card">
              <h3 className="text-xl font-display font-bold mb-5 text-[var(--text-primary)]">Frontend</h3>
              <div className="flex flex-wrap gap-2.5">
                {["Next.js", "React", "TypeScript", "JavaScript", "Tailwind", "CSS", "Redux", "Selenium"].map(skill => (
                  <span key={skill} className="tag flex items-center gap-1.5 px-3 py-1.5 bg-[var(--surface)] text-[var(--text-primary)] font-medium border border-[var(--border)] rounded-full hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                    <TechIcon tag={skill === "Tailwind" ? "CSS Modules" : skill} size={14} />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="p-6 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] card">
              <h3 className="text-xl font-display font-bold mb-5 text-[var(--text-primary)]">Backend</h3>
              <div className="flex flex-wrap gap-2.5">
                {["Java", "Spring Boot", "Node.js", "Python", "Express"].map(skill => (
                  <span key={skill} className="tag flex items-center gap-1.5 px-3 py-1.5 bg-[var(--surface)] text-[var(--text-primary)] font-medium border border-[var(--border)] rounded-full hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                    <TechIcon tag={skill} size={14} />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] card">
              <h3 className="text-xl font-display font-bold mb-5 text-[var(--text-primary)]">Cloud & Tools</h3>
              <div className="flex flex-wrap gap-2.5">
                {["AWS", "GCP", "Azure", "Splunk", "Git"].map(skill => (
                  <span key={skill} className="tag flex items-center gap-1.5 px-3 py-1.5 bg-[var(--surface)] text-[var(--text-primary)] font-medium border border-[var(--border)] rounded-full hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                    <TechIcon tag={skill === "Azure" || skill === "GCP" ? "AWS" : skill} size={14} />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Education, Certifications & Awards */}
        <div>
          <h2 className="font-display text-4xl italic font-bold text-[var(--text-primary)] mb-10">
            Education & Awards
          </h2>
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] card">
              <h3 className="text-xl font-display font-bold mb-2 text-[var(--text-primary)]">National Institute of Technology Karnataka</h3>
              <p className="text-[var(--accent)] font-medium mb-3 text-lg">BE - Mechanical Engineering</p>
              <p className="text-sm font-mono tracking-wider text-[var(--text-muted)] bg-[var(--surface)] inline-block px-3 py-1 rounded-md">2014 - 2018</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] card">
              <h3 className="text-xl font-display font-bold mb-5 text-[var(--text-primary)]">Certifications</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-[var(--text-secondary)] font-medium">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0 shadow-[0_0_8px_var(--accent)]" />
                  Google Cloud Certified Cloud Digital Leader <span className="text-xs text-[var(--text-muted)] ml-auto shrink-0 mt-1">2023 - 2026</span>
                </li>
                <li className="flex items-start gap-3 text-[var(--text-secondary)] font-medium">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0 shadow-[0_0_8px_var(--accent)]" />
                  Microsoft Certified: Azure AI Fundamentals <span className="text-xs text-[var(--text-muted)] ml-auto shrink-0 mt-1">2023</span>
                </li>
                <li className="flex items-start gap-3 text-[var(--text-secondary)] font-medium">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0 shadow-[0_0_8px_var(--accent)]" />
                  Microsoft Certified: Azure Fundamentals <span className="text-xs text-[var(--text-muted)] ml-auto shrink-0 mt-1">2023</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] card">
              <h3 className="text-xl font-display font-bold mb-2 text-[var(--text-primary)]">Team Spotlight Award</h3>
              <p className="text-[var(--accent)] font-medium mb-4 text-lg">Wells Fargo <span className="text-sm text-[var(--text-muted)] ml-2 font-mono">12/2022</span></p>
              <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                Recognized for contributions to the Model Registration and Validation project, which led to the successful decommissioning of a third-party product for EUCT, resulting in significant cost savings for the company.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 04. CTA */}
      <section className="flex flex-col items-center justify-center text-center py-24 mb-10 bg-[var(--surface-raised)] rounded-3xl border border-[var(--border)]">
        <h2 className="font-display text-4xl md:text-5xl italic font-bold text-[var(--text-primary)] mb-6">
          Let’s connect
        </h2>
        <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 max-w-xl px-4 leading-relaxed">
          Whether you’re building something new or just want to swap stories, let’s have a chat. I typically reply within a day.
        </p>
        <a
          href="mailto:jakeerchilakala@gmail.com"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95 text-lg shadow-xl hover:shadow-[0_0_20px_var(--accent)]"
          style={{ background: "var(--text-primary)", color: "var(--bg-primary)" }}
        >
          Get in touch <FaEnvelope />
        </a>
      </section>
    </div>
  );
}
