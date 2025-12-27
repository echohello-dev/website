export default function Footer() {
  return (
    <footer className="bg-charcoal text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-orange">echo</span>Hello
            </h3>
            <p className="text-gray-300">
              Building innovative web solutions with modern technologies.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com/echohello-dev" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-orange transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://discord.gg/echohello" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-orange transition-colors">
                  Discord
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-300">
              Ready to work together? Join our community!
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} echoHello. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
