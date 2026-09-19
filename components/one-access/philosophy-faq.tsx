import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import styles from "./philosophy-faq.module.css";

const questions = [
  {
    question: "ONE:ACCESS est-il déjà un référentiel définitif ?",
    answer: "Non. ONE:ACCESS est encore en cours de réflexion et de construction. L'objectif est d'expérimenter une approche, de la confronter au réel et de montrer qu'en questionnant les parcours autrement, des solutions peuvent émerger là où une situation était jusque-là simplement considérée comme « accessible ».",
  },
  {
    question: "ONE:ACCESS sert-il à mesurer ou à concevoir ?",
    answer: "Les deux. La mesure permet d'abord de rendre visibles les écarts entre deux parcours vers une même destination. Ce constat peut ensuite guider la recherche de solutions, puis permettre de mesurer si les changements réalisés réduisent effectivement ces écarts.",
  },
  {
    question: "Faut-il que tout le monde emprunte exactement le même chemin ?",
    answer: "Non. Deux parcours peuvent être différents. L'objectif n'est pas de rendre systématiquement les chemins identiques, mais de réduire leurs écarts en matière de distance, de temps, d'effort, de complexité et d'autonomie.",
  },
  {
    question: "Que se passe-t-il lorsqu'un écart important est constaté ?",
    answer: "ONE:ACCESS n'a pas vocation à désigner un coupable. Il établit un constat aussi objectif que possible. À partir de celui-ci, l'enjeu est de comprendre ce qui produit l'écart, construire un plan d'action, apporter des adaptations puis mesurer à nouveau.",
  },
  {
    question: "À quoi ressemblerait une réussite pour ONE:ACCESS ?",
    answer: "Elle peut prendre plusieurs formes : voir des bâtiments expérimenter le référentiel, influencer les choix dès la conception, permettre de réduire concrètement des écarts qui auraient auparavant été considérés comme « accessibles donc suffisants », puis, à terme, aboutir à l'adoption officielle d'un référentiel éprouvé sur le terrain.",
  },
];
const steps = ["CONSTATER", "COMPRENDRE", "AGIR", "REMESURER", "RÉDUIRE L'ÉCART"];

export function PhilosophyFaq() {
  return (
    <section id="philosophy-faq" aria-labelledby="philosophy-faq-title" className={styles.faq}>
      <p className={styles.label}>05 — QUESTIONS FRÉQUENTES</p>
      <div className={styles.layout}>
        <h2 id="philosophy-faq-title" tabIndex={-1} className={styles.title}>
          POUR ALLER<br />UN PEU PLUS LOIN.
        </h2>
        {/* The installed shadcn aria-lyra variant uses React Aria's native API.
            Single expansion and collapsing the open item are its defaults. */}
        <Accordion allowsMultipleExpanded={false} className={styles.accordion}>
          {questions.map(({ question, answer }, index) => (
            <AccordionItem key={question} id={`question-${index + 1}`} className={styles.item}>
              <AccordionTrigger className={styles.trigger}>
                <span aria-hidden="true" className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.question}>{question}</span>
              </AccordionTrigger>
              <AccordionContent className={styles.answer}>
                <p>{answer}</p>
                {index === 3 && (
                  <ol className={styles.process}>
                    {steps.map((step, stepIndex) => (
                      <li key={step}>
                        {stepIndex > 0 && <span aria-hidden="true">→</span>}
                        {step}
                      </li>
                    ))}
                  </ol>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
