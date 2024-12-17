import { useEffect } from 'react'
import { useNavigate } from 'react-router'

/**
 * Custom hook to intercept clicks on <a> elements and handle navigation using React Router.
 * Call this hook in the main component of your application to enable custom link handling.
 *
 * This hook sets up an event listener on the document to intercept clicks on <a> tags. If the
 * clicked <a> tag is an internal link (i.e., its URL starts with the current origin), the default
 * behavior is prevented and React Router's navigate function is used to change the route.
 */
const useInterceptLinks = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLAnchorElement

      // Check if the clicked element is an <a> tag and it's an internal link
      if (
        target.tagName === 'A' &&
        target.href.startsWith(window.location.origin)
      ) {
        event.preventDefault()
        const path = target.href.replace(window.location.origin, '')
        navigate(path)
      }
    }

    // Add event listener to the document
    document.addEventListener('click', handleClick)

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [navigate])
}

export default useInterceptLinks
