import {
    Activity,
    Bell,
    BookOpen,
    Home,
    PlusCircle,
    Trash2,
    User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type ApiArticle = {
    id: number;
    userId: number;
    title: string;
    body: string;
};

type ArticleCategory =
    | "All"
    | "Recycling 101"
    | "Zero Waste"
    | "Industrial"
    | "Composting";

type Article = {
    id: number;
    title: string;
    excerpt: string;
    body: string;
    category: Exclude<ArticleCategory, "All">;
    readTime: string;
    imageUrl: string;
    isFeatured: boolean;
};

const ARTICLE_FILTERS: ArticleCategory[] = [
    "All",
    "Recycling 101",
    "Zero Waste",
    "Industrial",
    "Composting",
];

function toTitleCase(text: string) {
    return text
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function getCategory(id: number): Exclude<ArticleCategory, "All"> {
    const categories: Array<Exclude<ArticleCategory, "All">> = [
        "Composting",
        "Recycling 101",
        "Zero Waste",
        "Industrial",
    ];

    return categories[(id - 1) % categories.length];
}

function getReadTime(body: string) {
    const words = body.trim().split(/\s+/).length;
    return `${Math.max(3, Math.ceil(words / 30))} min read`;
}

function mapArticle(post: ApiArticle, index: number): Article {
    return {
        id: post.id,
        title: toTitleCase(post.title),
        excerpt: post.body.replace(/\n/g, " ").slice(0, 120).trim(),
        body: post.body,
        category: getCategory(post.id),
        readTime: getReadTime(post.body),
        imageUrl: `https://picsum.photos/seed/trashi-article-${post.id}/800/600`,
        isFeatured: index === 0,
    };
}

export default function ArticlePage() {
    const navigate = useNavigate();
    const [articles, setArticles] = useState<Article[]>([]);
    const [activeFilter, setActiveFilter] = useState<ArticleCategory>("All");
    const [visibleCount, setVisibleCount] = useState(4);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function loadArticles() {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(
                    "https://jsonplaceholder.typicode.com/posts?_limit=12",
                    { signal: controller.signal },
                );

                if (!response.ok) {
                    throw new Error("Failed to load articles");
                }

                const data = (await response.json()) as ApiArticle[];
                setArticles(data.map(mapArticle));
            } catch (fetchError) {
                if (
                    fetchError instanceof DOMException &&
                    fetchError.name === "AbortError"
                ) {
                    return;
                }

                setError("Unable to load articles right now.");
            } finally {
                setIsLoading(false);
            }
        }

        loadArticles();

        return () => controller.abort();
    }, []);

    const filteredArticles = useMemo(() => {
        if (activeFilter === "All") return articles;
        return articles.filter((article) => article.category === activeFilter);
    }, [activeFilter, articles]);

    const featuredArticle = useMemo(
        () => filteredArticles[0] ?? null,
        [filteredArticles],
    );

    const gridArticles = useMemo(
        () => filteredArticles.slice(1, visibleCount + 1),
        [filteredArticles, visibleCount],
    );

    return (
        <div className="min-h-screen bg-[#F0F1F2]">
            <div className="min-h-screen bg-[#F8F9FA] shadow-[0_20px_40px_rgba(0,0,0,0.1)] relative flex flex-col">
                <header className="absolute top-0 left-0 right-0 h-16 px-4 flex items-center justify-between bg-[#F8F9FA] shadow-[0_1px_2px_rgba(0,0,0,0.05)] z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#0F5238] flex items-center justify-center">
                            <Trash2 className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-[#0F5238] font-bold text-[22px] leading-[30px] tracking-[-0.025em]">
                            Trash.I
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="w-10 h-10 rounded-full bg-[#EDEEEF] flex items-center justify-center"
                        >
                            <Bell className="w-4 h-4 text-[#404943]" />
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/profile")}
                            className="w-10 h-10 rounded-full bg-[#EDEEEF] flex items-center justify-center"
                        >
                            <User className="w-4 h-4 text-[#404943]" />
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto pt-20 pb-[88px] px-5 space-y-4">
                    <section className="space-y-2">
                        <h1 className="text-[20px] font-semibold leading-7 text-[#0F5238]">
                            Learn & Grow
                        </h1>
                        <p className="text-sm leading-5 text-[#404943]">
                            Explore articles on sustainability, recycling best practices, and environmental stewardship.
                        </p>
                    </section>

                    {featuredArticle ? (
                        <section className="overflow-hidden rounded-xl border border-[rgba(191,201,193,0.3)] bg-white shadow-[0_8px_24px_rgba(15,82,56,0.04)]">
                            <div className="relative h-48 bg-[#EDEEEF]">
                                <img
                                    src={featuredArticle.imageUrl}
                                    alt={featuredArticle.title}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-[#0F5238] px-3 py-1 text-xs font-semibold tracking-[0.05em] text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                                    <BookOpen className="w-3 h-3" />
                                    Featured
                                </div>
                            </div>
                            <div className="space-y-2 p-4">
                                <div className="flex gap-2 text-xs font-semibold tracking-[0.05em]">
                                    <span className="rounded-md bg-[rgba(204,230,208,0.5)] px-2 py-0.5 text-[#4C6452]">
                                        {featuredArticle.category}
                                    </span>
                                    <span className="px-2 py-0.5 text-[#404943]">
                                        {featuredArticle.readTime}
                                    </span>
                                </div>
                                <h2 className="text-[20px] font-semibold leading-7 text-[#191C1D]">
                                    {featuredArticle.title}
                                </h2>
                                <p className="text-sm leading-5 text-[#404943]">
                                    {featuredArticle.excerpt}...
                                </p>
                            </div>
                        </section>
                    ) : null}

                    <section className="flex gap-2 overflow-x-auto py-1">
                        {ARTICLE_FILTERS.map((filter) => {
                            const active = activeFilter === filter;
                            return (
                                <button
                                    key={filter}
                                    type="button"
                                    onClick={() => {
                                        setActiveFilter(filter);
                                        setVisibleCount(4);
                                    }}
                                    className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.05em] ${
                                        active
                                            ? "border-[#0F5238] bg-[#0F5238] text-white"
                                            : "border-[#BFC9C1] bg-[#F8F9FA] text-[#191C1D]"
                                    }`}
                                >
                                    {filter}
                                </button>
                            );
                        })}
                    </section>

                    <section>
                        {isLoading ? (
                            <div className="grid grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((item) => (
                                    <div
                                        key={item}
                                        className="overflow-hidden rounded-lg border border-[rgba(191,201,193,0.3)] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
                                    >
                                        <div className="h-28 bg-[#EDEEEF] animate-pulse" />
                                        <div className="space-y-2 p-3">
                                            <div className="h-3 rounded bg-[#EDEEEF] animate-pulse" />
                                            <div className="h-8 rounded bg-[#EDEEEF] animate-pulse" />
                                            <div className="h-3 rounded bg-[#EDEEEF] animate-pulse" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="rounded-xl border border-[#BFC9C1] bg-white p-6 text-center">
                                <p className="text-sm text-[#BA1A1A]">{error}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {gridArticles.map((article) => (
                                    <article
                                        key={article.id}
                                        className="overflow-hidden rounded-lg border border-[rgba(191,201,193,0.3)] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
                                    >
                                        <div className="h-28 bg-[#EDEEEF]">
                                            <img
                                                src={article.imageUrl}
                                                alt={article.title}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="space-y-2 p-3">
                                            <p className="text-xs font-semibold tracking-[0.05em] text-[#506856]">
                                                {article.category}
                                            </p>
                                            <h3 className="line-clamp-2 text-sm font-semibold text-[#191C1D]">
                                                {article.title}
                                            </h3>
                                            <div className="flex items-center justify-between text-xs text-[#404943]">
                                                <span>{article.readTime}</span>
                                                <span>#{article.id}</span>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>

                    {!isLoading && !error && filteredArticles.length > gridArticles.length + 1 ? (
                        <section className="flex justify-center pt-4 pb-6">
                            <button
                                type="button"
                                onClick={() => setVisibleCount((count) => count + 4)}
                                className="rounded-full bg-[#CCE6D0] px-6 py-3 text-xs font-semibold tracking-[0.05em] text-[#0F5238]"
                            >
                                Load More Articles
                            </button>
                        </section>
                    ) : null}
                </main>

                <nav className="absolute bottom-0 left-0 right-0 bg-[#F8F9FA] border-t border-[#BFC9C1] shadow-[0_-4px_20px_rgba(15,82,56,0.08)]">
                    <div className="flex items-center justify-between px-[22.6px] py-2">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="flex flex-col items-center text-[#404943] px-4 py-2"
                        >
                            <Home className="w-5 h-5" />
                            <span className="text-xs">Home</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/book-pickup")}
                            className="flex flex-col items-center text-[#404943] px-4 py-2"
                        >
                            <PlusCircle className="w-5 h-5" />
                            <span className="text-xs">Book</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/history")}
                            className="rounded-xl bg-[#CCE6D0] px-4 py-2 flex flex-col items-center text-[#506856]"
                        >
                            <Activity className="w-5 h-5" />
                            <span className="text-xs font-semibold">History</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/profile")}
                            className="flex flex-col items-center text-[#404943] px-4 py-2"
                        >
                            <User className="w-5 h-5" />
                            <span className="text-xs">Profile</span>
                        </button>
                    </div>
                </nav>
            </div>
        </div>
    );
}
