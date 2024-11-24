const Title = ({ title, className }: { title: string; className: string }) => {
  return (
    <h2 className={`text-2xl font-semibold capitalize ${className}`}>
      {title}
    </h2>
  );
};

export default Title;
