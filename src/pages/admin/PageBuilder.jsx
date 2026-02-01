import React, { useState, useEffect } from 'react';
import API_URL from "../../config/api";
import Button from '../../components/Button';
import Card from '../../components/Card';

const PageBuilder = () => {
    const [pages, setPages] = useState([]);
    const [selectedSlug, setSelectedSlug] = useState(null);

    const [slug, setSlug] = useState('');
    const [title, setTitle] = useState('');
    const [blocks, setBlocks] = useState([]);
    const [isPublished, setIsPublished] = useState(false);

    // Load pages on mount
    useEffect(() => {
        fetch(`${API_URL}/pages`)
            .then(res => res.json())
            .then(data => setPages(data))
            .catch(err => console.error(err));
    }, []);

    // Load existing page
    const loadPage = (page) => {
        setSelectedSlug(page.slug);
        setSlug(page.slug);
        setTitle(page.title);
        setBlocks(page.content_blocks || []);
        setIsPublished(page.is_published);
    };

    const addBlock = (type) => {
        const newBlock = { id: Date.now(), type, content: {} };
        if (type === 'hero') newBlock.content = { headline: 'New Hero', subheadline: 'Subtitle', cta: 'Click Me' };
        if (type === 'text') newBlock.content = { text: 'Enter your text here...' };
        if (type === 'image') newBlock.content = { src: 'https://via.placeholder.com/600x400', alt: 'Placeholder' };
        if (type === 'columns') newBlock.content = { left: 'Left content', right: 'Right content' };

        setBlocks([...blocks, newBlock]);
    };

    const updateBlock = (id, key, value) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, content: { ...b.content, [key]: value } } : b));
    };

    const moveBlock = (index, direction) => {
        const newBlocks = [...blocks];
        if (direction === 'up' && index > 0) {
            [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
        } else if (direction === 'down' && index < newBlocks.length - 1) {
            [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
        }
        setBlocks(newBlocks);
    };

    const deleteBlock = (id) => {
        setBlocks(blocks.filter(b => b.id !== id));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/pages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ slug, title, content_blocks: blocks, is_published: isPublished })
            });
            if (res.ok) alert('Page saved successfully!');
        } catch (err) {
            alert('Failed to save page');
        }
    };

    return (
        <div className="flex gap-6 h-[calc(100vh-100px)]">
            {/* Sidebar List */}
            <Card className="w-1/4 h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">Pages</h3>
                    <button onClick={() => { setSelectedSlug(null); setSlug(''); setTitle(''); setBlocks([]); }} className="text-blue-600 text-sm">+ New</button>
                </div>
                <div className="space-y-2">
                    {pages.map(p => (
                        <div
                            key={p.slug}
                            onClick={() => loadPage(p)}
                            className={`p-2 rounded cursor-pointer ${selectedSlug === p.slug ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50'}`}
                        >
                            {p.title} <span className="text-xs text-gray-400">/{p.slug}</span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Editor */}
            <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden">
                <Card className="flex-none">
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                            <label className="text-xs text-gray-500 uppercase font-bold">Page Title</label>
                            <input className="w-full text-lg font-bold border-b border-gray-200 outline-none py-1" value={title} onChange={e => setTitle(e.target.value)} placeholder="My Page" />
                        </div>
                        <div className="w-1/3">
                            <label className="text-xs text-gray-500 uppercase font-bold">URL Slug</label>
                            <input className="w-full text-sm border-b border-gray-200 outline-none py-1" value={slug} onChange={e => setSlug(e.target.value)} placeholder="my-page" />
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <button onClick={() => addBlock('hero')} className="px-3 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200">+ Hero</button>
                            <button onClick={() => addBlock('text')} className="px-3 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200">+ Text</button>
                            <button onClick={() => addBlock('image')} className="px-3 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200">+ Image</button>
                            <button onClick={() => addBlock('columns')} className="px-3 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200">+ Columns</button>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} />
                                Published
                            </label>
                            <Button onClick={handleSave}>Save Page</Button>
                        </div>
                    </div>
                </Card>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-20">
                    {blocks.length === 0 && (
                        <div className="h-full flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                            Select elements above to start building
                        </div>
                    )}

                    {blocks.map((block, index) => (
                        <div key={block.id} className="relative group border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
                            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white shadow rounded p-1">
                                <button onClick={() => moveBlock(index, 'up')} className="p-1 hover:text-blue-600">▲</button>
                                <button onClick={() => moveBlock(index, 'down')} className="p-1 hover:text-blue-600">▼</button>
                                <button onClick={() => deleteBlock(block.id)} className="p-1 hover:text-red-600 text-red-400">✕</button>
                            </div>

                            <div className="p-4 border-b border-gray-50 bg-gray-50 text-xs text-gray-500 uppercase font-bold">
                                {block.type} Block
                            </div>

                            <div className="p-6">
                                {block.type === 'hero' && (
                                    <div className="space-y-2">
                                        <input className="w-full text-2xl font-bold border-b border-transparent hover:border-gray-200 outline-none text-center" value={block.content.headline} onChange={e => updateBlock(block.id, 'headline', e.target.value)} />
                                        <input className="w-full text-gray-600 border-b border-transparent hover:border-gray-200 outline-none text-center" value={block.content.subheadline} onChange={e => updateBlock(block.id, 'subheadline', e.target.value)} />
                                        <div className="flex justify-center mt-4">
                                            <span className="px-6 py-2 bg-blue-600 text-white rounded opacity-50">{block.content.cta}</span>
                                        </div>
                                    </div>
                                )}

                                {block.type === 'text' && (
                                    <textarea className="w-full h-32 p-2 border border-transparent hover:border-gray-200 rounded resize-none outline-none" value={block.content.text} onChange={e => updateBlock(block.id, 'text', e.target.value)} />
                                )}

                                {block.type === 'image' && (
                                    <div className="flex gap-4">
                                        <div className="w-1/3 bg-gray-100 h-32 rounded flex items-center justify-center text-gray-400">Image Preview</div>
                                        <div className="flex-1 space-y-2">
                                            <input className="w-full p-2 border rounded" placeholder="Image URL" value={block.content.src} onChange={e => updateBlock(block.id, 'src', e.target.value)} />
                                            <input className="w-full p-2 border rounded" placeholder="Alt Text" value={block.content.alt} onChange={e => updateBlock(block.id, 'alt', e.target.value)} />
                                        </div>
                                    </div>
                                )}

                                {block.type === 'columns' && (
                                    <div className="flex gap-4">
                                        <textarea className="w-1/2 h-32 p-2 border border-transparent hover:border-gray-200 bg-gray-50 rounded resize-none" value={block.content.left} onChange={e => updateBlock(block.id, 'left', e.target.value)} />
                                        <textarea className="w-1/2 h-32 p-2 border border-transparent hover:border-gray-200 bg-gray-50 rounded resize-none" value={block.content.right} onChange={e => updateBlock(block.id, 'right', e.target.value)} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PageBuilder;
