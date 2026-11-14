import React from 'react';
import { ArrowUpRight } from 'lucide-react';


export default function ContactSection() {
  return (
    <section className="contact-section" aria-labelledby="contact-heading">

      <div className="contact-inner page-width">
        <h2 id="contact-heading">
          Let’s build something<br />meaningful.
        </h2>
        <div className="contact-copy">
          <p>
            Building in AI architecture, systems design, and building production-grade AI products.
          </p>
          <a className="light-action" href="mailto:abhinavsharma8750@gmail.com">
            Get in touch <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}

