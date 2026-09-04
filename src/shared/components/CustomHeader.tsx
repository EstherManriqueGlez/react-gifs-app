interface Props {
  title: string;
  description?: string;
}

const spotlightTitle = (title: string) => {
  const lastWordIndex = title.lastIndexOf(' ');
  const lastWord = lastWordIndex === -1 ? title : title.slice(lastWordIndex + 1);
  const rest = lastWordIndex === -1 ? '' : title.slice(0, lastWordIndex + 1);

  return (
    <>
      {rest}
      <span className="accent">{lastWord}</span>
    </>
  );
};

export const CustomHeader = ({ title, description }: Props) => {
  return (
    <header className="app-shell app-header">
      <nav className="app-nav" aria-label="Primary">
        <a className="app-brand" href="#">
          <span className="app-brand-mark" aria-hidden="true">
            G
          </span>
          <span className="app-brand-name">
            Gifs<span className="app-brand-accent">App</span>
          </span>
        </a>
      </nav>

      <div className="content-center">
        <h1>{spotlightTitle(title)}</h1>
        {description && <p>{description}</p>}
      </div>
    </header>
  );
};
