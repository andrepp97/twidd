import {
    FacebookIcon,
    FacebookShareButton,
    WhatsappIcon,
    WhatsappShareButton,
    TwitterIcon,
    TwitterShareButton,
} from "next-share"

interface ShareProps {
    url: string
}

const SharePost = ({ url }: ShareProps) => {
    return (
        <div className="flex items-center space-x-4">
            <FacebookShareButton url={url} onClick={e => e.stopPropagation()}>
                <FacebookIcon round size={36} />
            </FacebookShareButton>
            <TwitterShareButton url={url} onClick={e => e.stopPropagation()}>
                <TwitterIcon round size={36} />
            </TwitterShareButton>
            <WhatsappShareButton url={url} onClick={e => e.stopPropagation()}>
                <WhatsappIcon round size={36} />
            </WhatsappShareButton>
        </div>
    );
}

export default SharePost;