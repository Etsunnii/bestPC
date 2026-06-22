import { Logo } from "./Header.jsx";

const documents = [
  ["Политика конфиденциальности", "/privacy"],
  ["Согласие на обработку персональных данных", "/personal-data-consent"],
  ["Политика в отношении обработки персональных данных", "/personal-data-policy"],
];

export function SiteFooter({ navigate }) {
  return (
    <footer className="site-footer">
      <div className="site-footer__content">
        <div className="site-footer__brand">
          <div className="site-footer__brand-row">
            <Logo className="brand--footer" onClick={() => navigate("home")} />
            <strong>Beast PC</strong>
          </div>
          <p>Beast PC. Все права защищены.</p>
        </div>

        <div className="site-footer__column">
          <h2>Документы</h2>
          {documents.map(([document, href]) => (
            <a href={href} key={document}>{document}</a>
          ))}
        </div>

        <div className="site-footer__column site-footer__details">
          <h2>Реквизиты</h2>
          <p>ИП Марк Марков Маркович</p>
          <p>ИНН 123456789123</p>
          <p>ОГРНИП 123456789123456</p>
        </div>
      </div>

    </footer>
  );
}
