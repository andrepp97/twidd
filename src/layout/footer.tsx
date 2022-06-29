import Image from "next/image"
import Github from "../../public/icons8-github.svg"
import Linkedin from "../../public/icons8-linkedin.svg"

const Footer = () => {
    return (
        <div className="text-zinc-300 text-center border-t border-gray-700 p-8 mb-16 sm:mb-0">
            <div className="flex items-center justify-center">
                <strong>
                    &copy; 2022
                </strong>
                <p>
                    &nbsp;- Andre Putera Pratama
                </p>
            </div>
            <div className="space-x-4 mt-4">
                <a
                    href="https://www.linkedin.com/in/andreputera"
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    <Image
                        src={Linkedin}
                        alt="LinkedIn"
                        height={30}
                        width={30}
                    />
                </a>
                <a
                    href="https://github.com/andrepp97/tweetme"
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    <Image
                        alt="Github"
                        src={Github}
                        height={30}
                        width={30}
                    />
                </a>
            </div>
        </div>
    );
}

export default Footer;