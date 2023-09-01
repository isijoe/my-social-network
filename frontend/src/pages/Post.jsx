import { Carousel, Image } from "react-bootstrap";

const Post = (props) => {
  const { post, onItemClicked, style } = props;

  const selectPost = () => {
    onItemClicked(post);
  };

  return (
    <div className="post" onClick={selectPost}>
      <Carousel controls={post?.post_imgs.length > 1} indicators={post?.post_imgs.length > 1}>
        {post.post_imgs.map((image, index) =>
          <Carousel.Item key={image.id || image.image}>
            <Image
              style={style}
              src={image.image}
              alt={image.alt}
              thumbnail
            />
          </Carousel.Item>
        )}
      </Carousel>
    </div>
  );
};

export default Post;
