"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const google_1 = require("next/font/google");
require("./globals.css");
const inter = (0, google_1.Inter)({ subsets: ['latin'] });
exports.metadata = {
    title: 'Strato AI Sales Agent',
    description: 'AI-powered sales lead generation and management platform',
};
function RootLayout({ children, }) {
    return (<html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>);
}
