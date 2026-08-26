/**
 * App.tsx — thin entry wrapper.
 *
 * The whole experience lives in <UniversalAppGenerator />. This wrapper exists
 * so the app has a conventional App component you can mount elsewhere.
 */
import UniversalAppGenerator from "./UniversalAppGenerator";

export default function App() {
  return <UniversalAppGenerator />;
}
