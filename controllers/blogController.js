import Blog from "../models/Blog.js";
import slugify from "../utils/slugify.js";
import { successResponse, errorResponse, paginatedResponse } from "../utils/apiResponse.js";
import paginate, { getPaginationData } from "../utils/paginate.js";

const calculateReadTime = (content) => {
  const wordsPerMinute = 200;
  let totalWords = 0;
  content.forEach((block) => {
    if (block.text) totalWords += block.text.split(" ").length;
    if (block.items) totalWords += block.items.join(" ").split(" ").length;
  });
  const minutes = Math.ceil(totalWords / wordsPerMinute);
  return `${minutes} min read`;
};

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 9,
      category,
      featured,
      status = "published",
      sort = "newest",
      search,
    } = req.query;

    const { skip, limit: lim } = paginate(req.query, page, limit);
    const query = {};

    if (!req.user) query.status = "published";
    else if (status) query.status = status;

    if (category) query.category = category;
    if (featured === "true") query.featured = true;
    if (search) query.$text = { $search: search };

    const sortObj =
      sort === "oldest"
        ? { publishedAt: 1 }
        : sort === "popular"
        ? { views: -1 }
        : { publishedAt: -1 };

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .populate("category", "name slug color icon")
        .populate("author", "name avatar")
        .select("-content")
        .skip(skip)
        .limit(lim)
        .sort(sortObj),
      Blog.countDocuments(query),
    ]);

    return paginatedResponse(
      res,
      blogs,
      getPaginationData(total, page, limit),
      "Blogs fetched successfully"
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate("category", "name slug color icon")
      .populate("author", "name avatar");

    if (!blog) return errorResponse(res, "Blog not found", 404);

    // Increment views
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });

    return successResponse(res, blog, "Blog fetched successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Create blog
// @route   POST /api/blogs
// @access  Editor+
export const createBlog = async (req, res, next) => {
  try {
    const {
      title,
      excerpt,
      content,
      category,
      thumbnail,
      tags,
      featured,
      status,
      scheduledAt,
      commentsEnabled,
    } = req.body;

    const slug = slugify(title);
    const existing = await Blog.findOne({ slug });
    if (existing) return errorResponse(res, "Blog with this title already exists", 400);

    const readTime = content ? calculateReadTime(content) : "5 min read";

    const blog = await Blog.create({
      title,
      slug,
      excerpt,
      content: content || [],
      category,
      author: req.user._id,
      thumbnail: thumbnail || { url: "", publicId: "" },
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      readTime,
      featured: featured || false,
      status: status || "draft",
      publishedAt: status === "published" ? Date.now() : null,
      scheduledAt: scheduledAt || null,
      commentsEnabled: commentsEnabled !== undefined ? commentsEnabled : true,
    });

    const populated = await blog.populate([
      { path: "category", select: "name slug color" },
      { path: "author", select: "name avatar" },
    ]);

    return successResponse(res, populated, "Blog created successfully", 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Editor+
export const updateBlog = async (req, res, next) => {
  try {
    const {
      title,
      excerpt,
      content,
      category,
      thumbnail,
      tags,
      featured,
      status,
      scheduledAt,
      commentsEnabled,
    } = req.body;

    const blog = await Blog.findById(req.params.id);
    if (!blog) return errorResponse(res, "Blog not found", 404);

    const updateData = {
      excerpt,
      category,
      thumbnail,
      featured,
      status,
      scheduledAt,
      commentsEnabled,
    };

    if (title && title !== blog.title) {
      updateData.title = title;
      updateData.slug = slugify(title);
    }

    if (content) {
      updateData.content = content;
      updateData.readTime = calculateReadTime(content);
    }

    if (tags) updateData.tags = tags.split(",").map((t) => t.trim());
    if (status === "published" && !blog.publishedAt) {
      updateData.publishedAt = Date.now();
    }

    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: "category", select: "name slug color" },
      { path: "author", select: "name avatar" },
    ]);

    return successResponse(res, updated, "Blog updated successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Superadmin
export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return errorResponse(res, "Blog not found", 404);
    return successResponse(res, null, "Blog deleted successfully");
  } catch (error) {
    next(error);
  }
};