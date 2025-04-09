const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black pt-12 pb-6 mt-12">
        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm">&copy; {currentYear} Movie Bazer. By Djanati 2025.</p>
        </div>
    </footer>
  )
}

export default Footer

