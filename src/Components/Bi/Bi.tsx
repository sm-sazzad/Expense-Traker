interface BiProps {
  en: string;
  bn?: string;
  className?: string;
}

const Bi = ({ en, className }: BiProps) => {
  return <span className={className}>{en}</span>;
};

export default Bi;
