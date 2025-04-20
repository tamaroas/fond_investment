import { Navbar } from "../navbar/navbar";


interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
  dictionary: DictionaryType;
}

export function ContentLayout({ title, children, dictionary }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} dictionary={dictionary} />
      <div className="pt-8 pb-8 px-2 sm:px-8">{children}</div>
      {/* <div className="container pt-8 pb-8 px-2 sm:px-8">{children}</div> */}
    </div>
  );
}
