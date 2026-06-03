const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const { protect, admin } = require('../middleware/authMiddleware');
const { defaultContent } = require('../scripts/seedContent');

// GET all content for a page
router.get('/:page', async (req, res) => {
    try {
        const page = req.params.page;
        const content = await Content.findAll({ where: { page } });
        
        if (content.length === 0) {
            // Return default content if no content exists
            const defaultPageContent = defaultContent[page] || {};
            return res.json(defaultPageContent);
        }
        
        const contentMap = {};
        content.forEach(item => {
            contentMap[item.section] = item.data;
        });
        
        res.json(contentMap);
    } catch (error) {
        console.error('Content fetch error:', error);
        res.status(500).json({ message: 'Failed to fetch content', error: error.message });
    }
});

// UPDATE or CREATE content for a section
router.put('/', protect, admin, async (req, res) => {
    const { page, section, data } = req.body;
    
    if (!page || !section || !data) {
        return res.status(400).json({ message: 'Page, section, and data are required' });
    }
    
    try {
        const [content, created] = await Content.upsert(
            { page, section, data },
            { returning: true }
        );
        
        res.json({ 
            success: true, 
            message: `Content ${created ? 'created' : 'updated'} successfully`,
            content 
        });
    } catch (error) {
        console.error('Content update error:', error);
        res.status(400).json({ message: 'Failed to update content', error: error.message });
    }
});

// DELETE content section
router.delete('/:page/:section', protect, admin, async (req, res) => {
    const { page, section } = req.params;
    
    try {
        const deleted = await Content.destroy({
            where: { page, section }
        });
        
        if (deleted) {
            res.json({ success: true, message: 'Section deleted successfully' });
        } else {
            res.status(404).json({ message: 'Section not found' });
        }
    } catch (error) {
        console.error('Content delete error:', error);
        res.status(500).json({ message: 'Failed to delete section', error: error.message });
    }
});

// GET all pages with content
router.get('/', async (req, res) => {
    try {
        const pages = await Content.findAll({
            attributes: ['page'],
            group: ['page']
        });
        
        const pageList = pages.map(p => p.page);
        const allPages = [...new Set([...pageList, ...Object.keys(defaultContent)])];
        
        res.json(allPages);
    } catch (error) {
        console.error('Pages fetch error:', error);
        res.status(500).json({ message: 'Failed to fetch pages', error: error.message });
    }
});

module.exports = router;
